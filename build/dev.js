"use strict"

const chalk = require("chalk");
const electron = require("electron");
const path = require("path");
const { say } = require("cfonts");
const { spawn } = require("child_process");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackHotMiddleware = require("webpack-hot-middleware");

const appConfig = require("./webpack.app.config");
const webConfig = require("./webpack.web.config");

let electronProcess = null;
let manualRestart = false;
let hotMiddleware;

function logStats(proc, data)
{
	let log = "";

	log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join("-")}`);
	log += "\n\n";

	if(typeof data === "object")
	{
		data.toString
		({
			colors: true,
			chunks: false
		})
		.split(/\r?\n/).forEach(line =>
		{
			log += "  " + line + "\n";
		});
	}
	else
	{
		log += `  ${data}\n`;
	}

	log += "\n" + chalk.yellow.bold(`┗ ${new Array(28 + 1).join("-")}`) + "\n";

	console.log(log);
}

function startWeb()
{
	return new Promise((resolve, reject) =>
	{
		webConfig.entry.web = [path.join(__dirname, "dev.client")].concat(webConfig.entry.web);

		const compiler = webpack(webConfig);

		hotMiddleware = webpackHotMiddleware(compiler,
		{
			log: false,

			heartbeat: 2500
		});
		
		compiler.plugin("compilation", compilation =>
		{
			compilation.plugin("html-webpack-plugin-after-emit", (data, callback) =>
			{
				hotMiddleware.publish({ action: "reload" });
				
				callback();
			});
		});

		compiler.plugin("done", stats =>
		{
			logStats("Web", stats);
		});

		const server = new WebpackDevServer
		(
			compiler,
			{
				contentBase: path.join(__dirname, "../"),
				quiet: true,
				before(app, ctx)
				{
					app.use(hotMiddleware);
					
					ctx.middleware.waitUntilValid(() =>
					{
						resolve();
					})
				}
			}
		);
		
		server.listen(9080);
	});
}

function startApp()
{
	return new Promise((resolve, reject) =>
	{
		process.env.NODE_ENV = "development";
		
		const compiler = webpack(appConfig);

		compiler.plugin("watch-run", (compilation, done) =>
		{
			logStats("App", chalk.white.bold("compiling..."));

			hotMiddleware.publish({ action: "compiling" });

			done();
		});

		compiler.watch({}, (error, stats) =>
		{
			if(error)
			{
				console.log(error);

				return;
			}

			logStats("App", stats);

			if(electronProcess && electronProcess.kill)
			{
				manualRestart = true;

				process.kill(electronProcess.pid);

				electronProcess = null;

				startElectron();

				setTimeout(() =>
				{
					manualRestart = false;

				}, 5000);
			}

			resolve();
		})
	})
}

function startElectron()
{
	electronProcess = spawn(electron, ["--inspect=5858", path.join(__dirname, "../dist/web/app.js")]);

	electronProcess.stdout.on("data", data =>
	{
		electronLog(data, "blue");
	});

	electronProcess.stderr.on("data", data =>
	{
		electronLog(data, "red");
	});

	electronProcess.on("close", () =>
	{
		if(!manualRestart)
		{
			process.exit();
		}
	})
}

function electronLog(data, color)
{
	let log = "";

	data = data.toString().split(/\r?\n/);

	data.forEach(line =>
	{
		log += `  ${line}\n`;
	})

	if(/[0-9A-z]+/.test(log))
	{
		console.log(
			chalk[color].bold("┏ Electron -------------------") +
			"\n\n" +
			log +
			chalk[color].bold("┗ ----------------------------") +
			"\n"
		);
	}
}

function greeting()
{
    const cols = process.stdout.columns;
    
    let text = "";
    
    if(cols > 85)
    {
        text = "starting";
    }
    else
    {
        text = false;
    }

    if(text)
    {
        say(text,
        {
            colors: ["yellow"],
            font: "simple3d",
            space: false
        })
    }
    else
    {
        console.log(chalk.yellow.bold("\n  starting"));
    }
    
    console.log();
}

function init()
{
	greeting();

	Promise.all([startWeb(), startApp()])
	.then(() =>
	{
		startElectron();
	})
	.catch(error =>
	{
		console.error(error);
	});
}

init();