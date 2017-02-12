<style>
  .well,
  .searchPanel {
    background: rgba(255, 255, 255, .9);
  }

  .searchPanel input {
    margin: 1em;
    padding: 1em;
    text-align: center;
  }

  #avatar {
    border-radius:50%;
    float:right;
    clear:both;
    max-height: 150px;
  }

  body {
    padding-top: 60px;
    background-attachment:fixed;
    background-repeat: no-repeat;
    background-size: 100% auto;
  }
</style>

<template>
  <div class="row">
    <div class="panel panel-default searchPanel">
      <div class="panel-body">
        <div class="col-sm-8 col-md-7 col-md-offset-2">
          <input
              id="getUsername"
              type="text"
              class="form-control"
              placeholder="Username"
              v-model="user.name"
              @keyup.enter="submit"
              debounce="750">

          <scale-loader :loading="loading" :color="loadingColour" :height="height" :width="width"></scale-loader>
        </div>
      </div>
    </div>
  </div>

  <div class="row" v-if="UserData">
    <div class="col-xs-12">

      <div class="well">

        <img id="avatar" :src="UserData.image[2]['#text']">

        <h1 id="user"><a target="_blank" :href="UserData.url">{{UserData.name}}</a></h1>

        <h2 id="played">This user has played {{ UserData.playcount }} tracks!
          <span>That's {{ songsPerHour }} per hour.</span>
        </h2>

  	    <h2 id="nowplaying" v-if="NowPlaying">
          They are currently listening to: {{NowPlaying.name}} by {{currentArtist}}
        </h2>

  	    <h3 id="scrobbled" v-if="user.scrobbled.name != 'Nothing!'">
          They last scrobbled: {{user.scrobbled.name}} by {{ user.scrobbled.artist['#text'] }}
        </h3>

      </div>
    </div>
  </div>
</template>

<script>
    import { EventBus } from './event-bus.js';

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
          userData: {},
          loading: false,
        }
      },

      ready() {

      },

      watch: {
        'user.name'() {
          this.loading = true;
          this.submit();
        }
      },

      computed: {
        songsPerHour() {
          let songsPerHour = 0;

          if(this.UserData) {
            let registeredTime = this.UserData.registered.unixtime;
            let playCount = this.UserData.playcount;

            let delta = (((Date.now() - 1000*parseInt(registeredTime))/1000/3600)*10)/10;

            songsPerHour = Math.floor(playCount / (delta));
          }

          return songsPerHour;
        },

        UserData() {
          let loaded = false;

          if(
              this.userData &&
              this.userData.user &&
              this.userData.user !== '') {
            loaded = this.userData.user;
          }

          return loaded;
        },

        NowPlaying() {
          let loaded = false;

          if(
              this.user &&
              this.user.nowPlaying) {
            loaded = this.user.nowPlaying;
          }

          return loaded;
        },

        currentArtist() {
          let currentArtist = '';

          if(this.NowPlaying &&
              this.NowPlaying.artist != undefined) {
            currentArtist = this.NowPlaying.artist['#text'];
          }

          return currentArtist;
        },

        userImage(size = 0) {
          let user = this.getUserData();

          if(user) {

          }
        },

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
              EventBus.$emit('backgroundImageChange', images[images.length - 1]);
            }, false);

            this.source.addEventListener('user.lastPlayed', (e) => {
              let playingInfo = JSON.parse(e.data);
              this.user.scrobbled = JSON.parse(playingInfo.track);
            }, false);
          }

          this.getUserInfo(username).then(response => {
            this.userData = response.body;
            this.loading = false;
          }, response => {
            this.loading = false;
          });

        },

        getUserInfo(username) {
          return this.$http.get('https://barno.org:3000/lastfm', {
            params: {
              'user': username,
              'type': 'user.getInfo'
            }
          });
        }
      },

    }
</script>
