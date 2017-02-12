<template>
  <div class="row">
    <div class="panel panel-default" style="background: rgba(255,255,255,.7)">
      <div class="panel-heading">User</div>
      <div class="panel-body">
        <div class="col-xs-12 form-inline">
          <input id="getusername" type="text" class="form-control" placeholder="Username" v-model="user.name">
          <button class="btn btn-primary" @click="submit()">Get Info</button>
        </div>
      </div>
    </div>
  </div>

  <div class="row" v-if="userData.user.name !== ''">
    <div class="col-xs-12">
      <div class="well" style="background: rgba(255,255,255,.7)">
  	    <img id="avatar" width="auto" height="100%" style="border-radius:50%; float:right; clear:both; max-height: 200px" :src="userData.user.image[2]['#text']">
        <h1 id="user">Username: <a target="_blank" :href="userData.user.url">{{userData.user.name}}</a></h1>
  	    <h2 id="played">This user has played {{userData.user.playcount}} tracks!
          <span>That's {{ Math.floor(userData.user.playcount / ((Date.now() - 1000*parseInt(userData.user.registered.unixtime))/1000/3600)*10)/10 }} per hour.</span>
        </h2>
  	    <h2 id="nowplaying">They are currently listening to: {{user.nowPlaying.name}} by {{user.nowPlaying.artist['#text']}}</h2>
  	    <h3 id="scrobbled" v-if="user.scrobbled.track_name != ''">They last scrobbled: {{user.scrobbled.track_name}}</h3>

      </div>
    </div>
  </div>

  <div class="row" v-if="userData.user.name !== ''">
    <div class="well" style="background: rgba(255,255,255,.7)">
      <pre><code>{{ userData | json }}</code></pre>
      <pre v-if="window.location.hash.indexOf('debug') != -1"><code>{{ user.nowPlaying | json }}</code></pre>
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
                track_name: 'Nothing!'
              },
            },
            userData: {}
        }
      },

      ready() {

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
              document.body.style = "padding-top: 60px; background:url('"+this.user.nowPlaying.image[3]['#text']+"');background-attachment:fixed;background-size:cover;background-position";
            }, false);

            this.source.addEventListener('user.scrobbled', (e) => {
              let playingInfo = JSON.parse(e.data);
              this.user.scrobbled = playingInfo;
            }, false);
          } else {
            // Result to xhr polling :(
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
