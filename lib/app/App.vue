<template>
  <div class="app">
    <div class="sidebar">
      <h1>{{ title }}</h1>
      <page-list
        :pages="pages"
        :route="pageRoute"
        :selected-page="selectedPage"
      >
      </page-list>
    </div>

    <page :page="pages[selectedPage - 1]">
    </page>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  width: 100%;
  height: 100%;
  font-family: sans-serif;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAApCAYAAADNjfKJAAAAAXNSR0IArs4c6QAABTxJREFUWAlt14FRHEsMRdGFhSRwGHYaJgxIA8Kw07DDsNOww+Dr6NedGiirqlfd0tOTWprdgcvb29v958+f73/9+rXL+XK53NNsfK3sxTg/PT3tgrGnv337tjo8Hnt2+7gvBdBn0sgiLwgmEr4SscdxTlrhJTwXdzcHBQz+cvn+/ftlyHb/+/fvi+X85cuX3TvDwtHOZAq73NzcXCbBYuPAHX9YeDZyu5/z8fz8vFvE9gCRVBwtCc0vKdJz0WyR48lPl0MimOvDw8OV4+/fv2t4eXlZjXB8l8fHx+MsKRs8oZFYr6+vhw2XbrH//PlzNdvXr193T+O9i2AjTx8SIXATFTuTWt5tP3YprDiiADmsRph9Z85B0vZIgNkQKYRUTD5FKSS8s5i46kyXoS1yHafWb0u0qKAIALWMj2gZvITt+dkUQBPxRigufnZ8fNp+M2ffvWNGVQWYqJ5I2F4iTzeiRuBh5K/lXYDGCxc/3B0gI2GwSiIBKeA8M4nhEIuR+JxULLtYmH/JzQD8+qwgF0C6BRtBViKYbsNXTDeDrZuS81fMGXv98ePHzrxbpIGan/mY32CPAiTlhzd7WqFmLKHnoFWBfHhhyfEjw2gJtEjnRuOJrzsfWynmbKtLEuEhMM5829H52N9kevz7w09bfo8n8NhPEceLgZ3fGtK1s8E42+OMl80+Pue9uWosNyQD2iqr0MOVuH3zo3s2+IdwfeKTupENJr7rzMXa+Zmh1Xd6qjxmjEQys4dXbITFsOdnI2x4aPHs/WTvV81tVNTtJbIEkW7XGZaIcwtYsfwS8NtbfITdOR/7/rbXboBI3KoCSrYsJyIYBRAcYhNcBAcfjo+FbHJBOYAQRsRetVWPrL0ExbiZgs4/OHHHhxuO3Az4HhFCiSzOAIuaD0GI2SOyh2cvrmTFZXeGw1PMrY3ExN5yk9pGIxRISriH+ejW4ophs+Kii5PLwnm8UgMDEVqVPVAfibq9os5dy46Dr3PFyUPo/apJZKlcwKdPnxbga0MEklrv68L258+ftTtbvqK+UqTEcPakOBj2vbmkkp+rAi4pnd9NOvdgKUqsJBVYPBv+YnRJHPvOXCAn4nNwHQHkbzkTfjZSUWGdzzhJCf7GtDdnRGK+glRKIwesM3Bs55uwJcXA2Etk37kCusR1DPtKjaC5NAJnwb0O4fyl2s8oLRExS3GK69ZsXsVi8NDw27ExvHtTTTH75mEfouONN2T7BuO3pkvHGwqWf/Kv5rOHY8djn7YXc6tSolp7ValaZd1oq1zU/x+13Qk2Dnsx2k0mwWofOOJtv79wDgiQFsA2FS4RnzNfuGLY8klybrkzf7OHI3gV+e4/FvNphqr0fe8ZYLf3OjTDbovk/P3+2C3FEH9q1Rnn4o/ZjG1nNKBjhgM6ZpndTM0t3Qzp9rBz6+NsD39e+z6vugk85lVlqiSNpNaltRWWhmF3prspH2ELt4Y5bDVz2KeRrmq3dhPVwrGz2Vt8bGm44unstFVsuW6HZIdPt8Z5PMV1pdvw2RM3acZnnnXORw9aGHG6YYndn1eBDKQknIKn4mMUYZCJIdn2cPqIE4/lEuLs+WibbcckfddabRqudz8WzuxiLGdx2j1FrI+Nzzm8fTHFsW3bB7SVjOFoo0qdu/kEHQ8WPGGzvKWImCnksIvvxrUcX3JngyCJsPYLZqMFpmtn84ThdxZL2OAUVMvZ49m3GlBSQEnYIysR3T5/Z8mQ02wliheeD+fxZxRnD1jF0FpXwG7mo244I6m4EhoDW22HE+Nckbj/A0JbGUxhzbUVAAAAAElFTkSuQmCC);
}

.sidebar {
  flex: 2;
  padding: 1em;
  text-align: center;
  max-height: 100%;
  overflow: auto;
}

.sidebar h1 {
  font-size: 1em;
  margin: 0;
  margin-bottom: 1em;
}
</style>

<script>
  import Page from './Page.vue';
  import PageList from './PageList.vue';
  import { pages } from './_propTypes.js';

  export default {
    props: {
      title: String,
      pages,
      pageRoute: String,
      selectedPage: {
        type: Number,
        default: 1,
      },
    },
    components: {
      Page,
      PageList,
    },
  };
</script>
