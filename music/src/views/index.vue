<!--
 * @Author: llxs
 * @Date: 2023-03-20 20:54:31
 * @LastEditors: llxs
 * @LastEditTime: 2023-03-21 19:29:35
 * @Description: 
 * @custom_string_llxs_copyright: Copyright by llxs, All Rights Reserved. 
-->
<template>
    <div>
        <L2xsHeader></L2xsHeader>
        <router-view />
    </div>
</template>

<script>
import L2xsHeader from '@/components/l2xs-header/index'
export default {
    name: '',
    components: {
        L2xsHeader
    }
}
</script>

<style>

</style>