<template>
    <div class="v-dashboard">
        <i-row>
            <i-col span="12">
                <u-player src="rtsp://admin:admin123@10.10.10.127:554/mpeg4/ch1/main/av_stream"></u-player>
            </i-col>
            <i-col span="12">
                <u-player code="b" src="rtsp://admin:admin123@10.10.10.127:554/mpeg4/ch1/main/av_stream"></u-player>
            </i-col>
        </i-row>
        <i-row>
            <i-col span="12">
                <u-player code="a1" src="rtsp://admin:admin123@10.10.10.127:554/mpeg4/ch1/main/av_stream"></u-player>
            </i-col>
            <i-col span="12">
                <u-player code="b1" src="rtsp://admin:admin123@10.10.10.127:554/mpeg4/ch1/main/av_stream"></u-player>
            </i-col>
        </i-row>
    </div>
</template>

<style lang="less">
    @import "./dashboard.less";
</style>

<script lang="ts">
import { component, watch, View } from "flagwind-web";

import Player from "components/player";

/**
 * 工作台视图。
 * @class
 * @version 1.0.0
 */
@component
({
    components:
    {
        "u-player": Player
    }
})
export default class Dashboard extends View
{
    
}
</script>
