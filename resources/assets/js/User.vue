<style>
  .well,
  .searchPanel {
    background: rgba(255, 255, 255, .8);
  }

  #avatar {
    border-radius:50%;
    float:right;
    clear:both;
    max-height: 150px;
  }
</style>

<template>
  <div class="row">
    <div class="panel panel-default searchPanel">
      <div class="panel-heading">User</div>
      <div class="panel-body">
        <div class="col-xs-12 form-inline">
          <input
              id="getUsername"
              type="text"
              class="form-control"
              placeholder="Username"
              v-model="user.name"
              @keyup.enter="submit">

          <button
              class="btn btn-primary"
              @click="submit">
            Get Info
          </button>

        </div>
      </div>
    </div>
  </div>

  <div class="row" v-if="userLoaded">
    <div class="col-xs-12">

      <div class="well">
  	    <img id="avatar" width="auto" height="100%" style="" :src="userData.user.image[2]['#text']">
        <h1 id="user"><a target="_blank" :href="userData.user.url">{{userData.user.name}}</a></h1>

        <h2 id="played">This user has played {{ userData.user.playcount }} tracks!
          <span>That's {{ songsPerHour }} per hour.</span>
        </h2>

  	    <h2 id="nowplaying">They are currently listening to: {{user.nowPlaying.name}} by {{user.nowPlaying.artist['#text']}}</h2>
  	    <h3 id="scrobbled" v-if="user.scrobbled.name != 'Nothing!'">They last scrobbled: {{user.scrobbled.name}} by {{ user.scrobbled.artist['#text'] }}</h3>

      </div>
    </div>
  </div>
</template>

<script>
    export default {
      data() {
        return {
            user: {
              name: '',
              nowPlaying: {
                track_name: 'Nothing!'
              },
              scrobbled: {
                name: 'Nothing!'
              },
            },
            userData: {}
        }
      },

      ready() {

      },

      computed: {
        songsPerHour() {
          let registeredTime = this.userData.user.registered.unixtime;
          let playCount = this.userData.user.playcount;

          let delta = (((Date.now() - 1000*parseInt(registeredTime))/1000/3600)*10)/10;

          return Math.floor(playCount / (delta));
        },

        userLoaded() {
          let loaded = false;

          if(
              this.userData &&
              this.userData.user &&
              this.userData.user !== '') {
            loaded = true;
          }

          return loaded;
        }
      },

      methods: {
        submit() {
          let username = this.user.name;
          this.user.nowPlaying.track_name = 'Nothing!';
          this.user.scrobbled.track_name = 'Nothing!';

          if (!!window.EventSource) {
            if(this.source) {
              this.source.close();
            }

            this.source = new EventSource('https://barno.org:3000/lastfm/user-update-stream?username=' + username);

            this.source.addEventListener('user.nowPlaying', (e) => {
              let playingInfo = JSON.parse(e.data);
              this.user.nowPlaying = JSON.parse(playingInfo.track);

              let images = this.user.nowPlaying.image;
              document.body.style = "padding-top: 60px; background:url('"+images[images.length -1]['#text']+"');background-attachment:fixed;background-size:cover;background-position";
            }, false);

            this.source.addEventListener('user.lastPlayed', (e) => {
							console.log(e.data);
              let playingInfo = JSON.parse(e.data);
              this.user.scrobbled = JSON.parse(playingInfo.track);
            }, false);
          }

          this.$http.get('https://barno.org:3000/lastfm', {
            params: {
              'user': username,
              'type': 'user.getInfo'
            }
          }).then(response => {
            this.userData = response.body;
          }, response => {

          });
        }


      }
    }
</script>
