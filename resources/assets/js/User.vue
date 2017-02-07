<template>
    <input
        type="text"
        placeholder="Username"
        v-model="user.name"
    >
    <button class="btn btn-primary" @click="submit()">Get Info</button>
    <img :src="userData.user.image[2]['#text']" />
    <h1>Username: <a target="_blank" :href="userData.user.url">{{userData.user.name}}</a></h1>
    <h2>This user has played {{userData.user.playcount}} tracks!</h2>
    <h2>They are currently listening to: {{user.nowPlaying.track_name}}</h2>
    <h3>They last scrobbled: {{user.scrobbled.track_name}}</h3>

    <!--<h2>User Data: {{userData | json}}</h2>-->
</template>

<script>
    export default {
      data: function() {
        return {
            user: {
              name: '',
              nowPlaying: {
                track_name: 'Nothing!'
              },
              scrobbled: {
                track_name: 'Nothing!'
              }
            },
            userData: {}
        }
      },

      ready: function() {

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

            this.source = new EventSource('http://192.168.1.180:3000/lastfm/user-update-stream?username=' + username);
            this.source.addEventListener('user.nowPlaying', (e) => {
              let playingInfo = JSON.parse(e.data);
              this.user.nowPlaying = playingInfo;
            }, false);

            this.source.addEventListener('user.scrobbled', (e) => {
              let playingInfo = JSON.parse(e.data);

              this.user.scrobbled = playingInfo;
            }, false);
          } else {
            // Result to xhr polling :(
          }

          this.$http.get('http://192.168.1.180:3000/lastfm', {
            params: {
              'user': username,
              'type': 'user.getInfo'
            }
          }).then(response => {

            // get body data
            this.userData = response.body;

          }, response => {
            // error callback
          });
        }


      }
    }
</script>