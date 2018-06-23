/*!
 * Authors:
 *      jason <jasonsoop@gmail.com>
 * 
 * Copyright (C) 2010-present Flagwind Inc. All rights reserved. 
 */

import flagwind from "flagwind-core";
import ApplicationContext from "./context";

// 获取应用上下文
let context = ApplicationContext.current;

// 启动应用程序
flagwind.Application.start(context);
