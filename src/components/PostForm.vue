<template>
  <form class="modify-post"
    @submit.prevent="modifyPost">
    <QuillEditor toolbar="#my-toolbar"
      v-model:content="content"
      contentType="html"
      :modules="modules"
      ref="quill"
      theme="snow"
      placeholder="Share your thoughts...">
      <template #toolbar>
        <div id="my-toolbar">
          <button class="ql-bold"
            aria-label="bold font"></button>
          <button class="ql-italic"
            aria-label="italic font"></button>
          <button class="ql-link"
            aria-label="add a link"></button>
          <button class="ql-image"
            aria-label="upload an image"></button>
          <button class="ql-list"
            value="ordered"
            type="button"
            aria-label="ordered list"></button>
          <button class="ql-list"
            value="bullet"
            type="button"
            aria-label="unordered list"></button>
          <select class="ql-size">
            <option value="small"></option>
            <!-- Note a missing, thus falsy value, is used to reset to default -->
            <option selected></option>
            <option value="large"></option>
            <option value="huge"></option>
          </select>
        </div>
      </template>
    </QuillEditor>
    <div class="btn-div createpost-btn-div">
      <button type="submit"
        class="btn createpost-btn">Update</button>
    </div>
  </form>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageUploader from 'quill-image-uploader'
import axios from 'axios'
export default {
  setup() {
    const modules = {
      name: 'imageUploader',
      module: ImageUploader,
      options: {
        upload: file => {
          return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('file', file)
            axios
              .post('/posts/images', formData)
              .then(response => {
                resolve(response.data.url)
              })
              .catch(error => {
                reject('Upload failed')
                console.error('Error:', error)
              })
          })
        }
      }
    }
    return { modules }
  },
  components: { QuillEditor },
  props: ['post'],

  data() {
    return {
      content: this.post.content,
      files: []
    }
  },
  methods: {
    modifyPost() {
      axios
        .patch(`/posts/${this.$route.params.postId}`, {
          content: this.$refs.quill.getHTML(),
          files: this.files
        })
        .then(() => {
          this.succesufullyUpdated = true
          setTimeout(() => (this.succesufullyUpdated = false), 2000)
          this.$router.push('/usercontent')
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables.scss';
@import '@/scss/_mixins.scss';
.modify-post {
  margin: 3rem auto;
  width: 70%;
  @media (max-width: $large-breakpoint) {
    width: 90%;
  }
  @media (max-width: $small-breakpoint) {
    padding: 2rem;
    margin: 0;
  }
  @media (max-width: $xsmall-breakpoint) {
    width: auto;
    padding: 2rem 0;
  }
}
.createpost-btn-div {
  margin: 2rem 0 0;
  @media (max-width: $xsmall-breakpoint) {
    margin: 2rem 0 1rem;
  }
}
.createpost-btn {
  width: 40%;
}
</style>
