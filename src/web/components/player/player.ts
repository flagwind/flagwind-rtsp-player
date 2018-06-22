/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import { component, config, watch, Component } from "flagwind-web";
import "./player.less";

// tslint:disable-next-line:variable-name no-var-requires
const Player = require("wcjs-player");

// tslint:disable-next-line:no-var-requires
const webChimera = require("wcjs-prebuilt");

/**
 * 播放器。
 * @class
 * @version 1.0.0
 */
@component
({
    template: require("./player.html")
})
export default class Video extends Component
{
    private _player: any;               // 播放器实例
    
    /**
     * 获取播放器的编号。
     * @protected
     * @property
     * @returns string
     */
    protected get id(): string
    {
        return `player-${this.code}`;
    }

    /**
     * 获取或设置视频编号。
     * @public
     * @config
     * @returns string
     */
    @config({required: true, type: String})
    public code: string;

    /**
     * 获取或设置需要显示的消息。
     * @public
     * @config
     * @returns string
     */
    @config({type: String})
    public message: string;

    /**
     * 获取或设置播放地址。
     * @public
     * @config
     * @returns string
     */
    @config({required: true, type: String})
    public src: string;
    
    /**
     * 创建组件时调用的钩子方法。
     * @protected
     * @override
     * @returns void
     */
    protected mounted(): void
    {
        try
        {
            // 初始化播放器
            this._player = new Player("#" + this.id).addPlayer
            ({
                autoplay: true,
                mute: true,
                titleBar: "none",
                // allowFullscreen: false,
                wcjs: webChimera
            });

            this._player.onError = (error: any) =>
            {
                this.message = "播放失败";

                console.error(error);
            };
            
            // 关闭播放器的操作条
            this._player.ui(false);

            // 设置视频源
            this.setSource(this.src);
        }
        catch(ex)
        {
            this.message = "初始化错误";

            console.error(ex);
        }
    }

    /**
     * 当 "src" 发生变动时调用。
     * @protected
     * @param  {String} src 视频源。
     * @returns void
     */
    @watch("src")
    protected onSourceChange(src: string): void
    {
        this.setSource(src);
    }

    /**
     * 设置播放器的视频源。
     * @private
     * @param  {String} src 视频源。
     * @returns void
     */
    private setSource(src: string): void
    {
        if(src)
        {
            try
            {
                this._player.stop();
                this._player.clearPlaylist();
                this._player.addPlaylist(src);
                this._player.play();
            }
            catch(ex)
            {
                this.message = "播放失败";
                
                console.error(ex);
            }
        }
    }
}
