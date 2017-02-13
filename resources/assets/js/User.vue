<style>
  .well,
  .searchPanel {
    background: rgba(255, 255, 255, .9);
  }

  .searchPanel input {
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

  .panel-body {
    padding: 1em;
  }

  .user-data {
    padding: 1em;
  }

  h1, h2, h3 {
    font-family: Audimat, "Arial Black";
    font-weight: 400;
    text-align: left;
  }

  h1#user {
    margin-top: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
</style>

<template>
  <div>
  <div class="row">
    <div class="panel panel-default searchPanel">
      <div class="panel-body">
        <input
            id="getUsername"
            type="text"
            class="form-control"
            placeholder="Username"
            v-model="user.name"
            @keyup.enter="getUser">

        <scale-loader :loading="loading"></scale-loader>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div class="well user-data" v-if="UserData">
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
  </transition>
  </div>
</template>

<script>
    import Vue from 'vue';
    import _ from 'lodash';
    import { EventBus } from './event-bus.js';

    export default Vue.component('user', {
      props: ['username'],
      data() {
        console.log(this.username);
        return {
          user: {
            name: this.username,
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

      mounted() {
        this.getUser();
      },

      watch: {
        'user.name'() {
          this.getUser();
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
        getUser: _.debounce(function() {
          let username = this.user.name;
          this.user.nowPlaying.track_name = 'Nothing!';
          this.user.scrobbled.track_name = 'Nothing!';

          this.loading = true;
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

        }, 750),

        getUserInfo(username) {
          return this.$http.get('https://barno.org:3000/lastfm', {
            params: {
              'user': username,
              'type': 'user.getInfo'
            }
          });
        }
      }
    });
</script>
