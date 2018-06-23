/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import { component, config, watch, Component } from "flagwind-web";
import "./player.less";

// tslint:disable-next-line:variable-name no-var-requires
const WebChimera = require("wcjs-player");
// tslint:disable-next-line:no-var-requires
const wcjs = require("wcjs-prebuilt");

const seed = new Array<string>("A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "p", "Q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "2", "3", "4", "5", "6", "7", "8", "9");
const seedlength = seed.length;

const getRandomCode = (size: number) =>
{
    let result = "";

    for(let i = 0; i < size; i++)
    {
        const j = Math.floor(Math.random() * seedlength);

        result += seed[j];
    }

    return result;
};

/**
 * 播放器。
 * @class
 * @version 1.0.0
 */
@component
({
    template: require("./player.html")
})
export default class Player extends Component
{
    private _videoId: string;           // 播放器编号
    private _video: any;                // 播放器实例

    /**
     * 获取视频编号。
     * @protected
     * @property
     * @returns string
     */
    protected get videoId(): string
    {
        if(!this._videoId)
        {
            this._videoId = `player-${getRandomCode(6)}`;
        }

        return this._videoId;
    }

    public get video(): object
    {
        return this._video;
    }

    /**
     * 获取或设置需要显示的消息。
     * @public
     * @config {string}
     * @description 动态配置，支持响应式。
     */
    @config({type: String})
    public message: string;

    /**
     * 获取或设置播放地址。
     * @public
     * @config {string}
     * @description 动态配置，支持响应式。
     */
    @config({required: true, type: String})
    public src: string;

    /**
     * 获取或设置是否显示播放器UI。
     * @public
     * @config {boolean}
     * @default false
     * @description 动态配置，支持响应式。
     */
    @config({type: Boolean, default: false})
    public ui: boolean;

    /**
     * 获取或设置是否自动播放。
     * @public
     * @config {boolean}
     * @default true
     * @description 静态配置，不支持响应式。
     */
    @config({type: Boolean, default: true})
    public autoplay: boolean;

    /**
     * 获取或设置是否以静音方式播放。
     * @public
     * @config {boolean}
     * @default false
     * @description 静态配置，不支持响应式。
     */
    @config({type: Boolean, default: false})
    public mute: boolean;
    
    /**
     * 获取或设置是否自动循环播放。
     * @public
     * @config {boolean}
     * @default false
     * @description 静态配置，不支持响应式。
     */
    @config({type: Boolean, default: false})
    public loop: boolean;

    /**
     * 获取或设置是否允许全屏播放。
     * @public
     * @config {boolean}
     * @default true
     * @description 静态配置，不支持响应式。
     */
    @config({type: Boolean, default: true})
    public allowFullscreen: boolean;

    /**
     * 获取或设置网络资源缓存值（单位：毫秒）。
     * @public
     * @config {number}
     * @default 10000
     * @description 静态配置，不支持响应式。
     */
    @config({type: Number, default: 10000})
    public buffer: number;

    /**
     * 获取或设置标题栏何时可见。
     * @public
     * @config {string}
     * @default "none"
     * @description 取值范围:"fullscreen"、"minimized"、"both"、"none" 静态配置，不支持响应式。
     */
    @config({type: String, default: "none"})
    public titleBar: string;

    /**
     * 获取或设置VLC参数。
     * @public
     * @config {Array<string>}
     * @description 静态配置，不支持响应式。
     * @see https://wiki.videolan.org/VLC_command-line_help
     */
    @config({type: Array})
    public vlcArgs: Array<string>;

    /**
     * 获取或设置WCJS选项。
     * @public
     * @config {Object}
     * @description 静态配置，不支持响应式。
     * @see https://github.com/Magics-Group/wcjs-renderer
     */
    @config({type: Object})
    public wcjsRendererOptions: object;

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
            const options: any =
            {
                wcjs: wcjs,
                autoplay: this.autoplay,
                mute: this.mute,
                loop: this.loop,
                allowFullscreen: this.allowFullscreen,
                buffer: this.buffer,
                titleBar: this.titleBar
            };

            if(this.vlcArgs)
            {
                options.vlcArgs = this.vlcArgs;
            }

            if(this.wcjsRendererOptions)
            {
                options.wcjsRendererOptions = this.wcjsRendererOptions;
            }

            // 初始化播放器
            this._video = new WebChimera(`#${this.videoId}`).addPlayer(options);

            this._video.onError = (error: any) =>
            {
                this.onPlayError(error);
            };

            // 设置播放器UI
            this.setUserInterface(this.ui);

            // 设置视频源
            this.setSource(this.src);
        }
        catch(ex)
        {
            this.onPlayError(ex);
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
     * 当 "ui" 发生变动时调用。
     * @protected
     * @param  {boolean} ui 是否显示UI界面。
     * @returns void
     */
    @watch("ui")
    protected onUIChange(ui: boolean): void
    {
        this.setUserInterface(ui);
    }

    /**
     * 设置播放器的视频源。
     * @private
     * @param  {string} src 视频源。
     * @returns void
     */
    private setSource(src: string): void
    {
        if(src)
        {
            this._video.pause();
            this._video.clearPlaylist();
            this._video.addPlaylist(src);
            this._video.play();
        }
    }
    
    /**
     * 设置播放器的UI界面是否显示。
     * @param  {boolean} show
     * @returns void
     */
    private setUserInterface(show: boolean): void
    {
        this._video.ui(show);
    }

    private onPlayError(error: any): void
    {
        this.message = "播放失败";

        console.error(error);
    }
}
