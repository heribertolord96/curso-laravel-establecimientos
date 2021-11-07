<template>
    <div>
        <vue-page-transition name="fade-in-right">
            <router-view></router-view>
        </vue-page-transition>
    </div>
</template>


<script>

import store from '../store'

export default {
    store
}
</script>
