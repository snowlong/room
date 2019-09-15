<template>
  <div>
    <!-- ログイン時にはフォームとログアウトボタンを表示 -->
    <div v-if="user.uid" key="login">
      <div class="flex bg-white max-w-lg mx-auto rounded-lg py-2 mb-3">
        <img
          class="h-12 w-12 md:h-16 md:w-16 rounded-full ml-3"
          :src="user.photoURL"
        />
        <div class="ml-2 my-auto text-left">
          <div class="flex flex-row">
            <h2 class="text-sm font-semibold">{{ user.displayName }}</h2>
          </div>
        </div>
      </div>
      <div>
        <button
          class="border rounded-lg bg-white text-gray-800 m-2 px-3 py-2"
          type="button"
          @click="logout"
        >
          ログアウト
        </button>
      </div>
      <!-- Firebase から取得したリストを描画（トランジション付き） -->
      <transition-group name="chat" tag="div" class="list content">
        <section
          v-for="{ key, name, image, message } in chat"
          :key="key"
          class="item"
        >
          <div class="item-image">
            <img :src="image" width="40" height="40" />
          </div>
          <div class="item-detail">
            <div class="item-name">{{ name }}</div>
            <div class="item-message">
              <nl2br tag="div" :text="message" />
            </div>
          </div>
        </section>
      </transition-group>

      <!-- 入力フォーム -->
      <form action="" class="form" @submit.prevent="doSend">
        <textarea
          v-model="input"
          :disabled="!user.uid"
          class="border"
          @keydown.enter.exact.prevent="doSend"
        ></textarea>
        <button type="submit" :disabled="!user.uid" class="send-button">
          Send
        </button>
      </form>
    </div>
    <!-- 未ログイン時にはログインボタンを表示 -->
    <div v-else key="logout">
      <div>
        <i class="fa fa-twitter"></i>
        <button
          class="border rounded-lg twitter-bg-color twitter-border-color m-1 px-3 py-2 text-white text-center"
          @click="login"
        >
          Sign in with <b>Twitter</b>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  data() {
    return {
      user: {}, // ユーザー情報
      chat: [], // 取得したメッセージを入れる配列
      input: '' // 入力したメッセージ
    }
  },
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user || {}
      const refMessage = firebase.database().ref('message')
      if (user) {
        this.chat = []
        // message に変更があったときのハンドラを登録
        refMessage.limitToLast(10).on('child_added', this.childAdded)
      } else {
        // message に変更があったときのハンドラを解除
        refMessage.limitToLast(10).off('child_added', this.childAdded)
      }
    })
  },
  methods: {
    login() {
      const provider = new firebase.auth.TwitterAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    logout() {
      firebase.auth().signOut()
    },
    scrollBottom() {
      this.$nextTick(() => {
        window.scrollTo(0, document.body.clientHeight)
      })
    },
    // 受け取ったメッセージをchatに追加
    // データベースに新しい要素が追加されると随時呼び出される
    childAdded(snap) {
      const message = snap.val()
      this.chat.push({
        key: snap.key,
        name: message.name,
        image: message.image,
        message: message.message
      })
      this.scrollBottom()
    },
    doSend() {
      if (this.user.uid && this.input.length) {
        // firebase にメッセージを追加
        firebase
          .database()
          .ref('message')
          .push(
            {
              message: this.input,
              name: this.user.displayName,
              image: this.user.photoURL
            },
            () => {
              this.input = '' // フォームを空にする
            }
          )
      }
    }
  }
}
</script>

<style scoped>
.twitter-bg-color {
  background-color: rgba(29, 161, 242, 1);
}
.twitter-border-color {
  border-color: #46b8da;
}
</style>
