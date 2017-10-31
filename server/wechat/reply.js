
const tip = '再次开发一波'



export default async (ctx, next) => {
	const message = ctx.weixin

	let zzc = require('../wechat')
	let client = zzc.getWechat()

	const menu = require('./menu').default
	await client.delMenu()
	const Meaudata = await client.handle('createMenu', menu)

	console.log(Meaudata);

	if(message.MsgType === 'event'){
		if(message.Event === 'subscribe'){
			ctx.body = tip
		}else if(message.Event === 'unsubscribe'){
			console.log('取关了')
		}else if(message.Event === 'LOCATION'){
			ctx.body = '上报成功'
		}
	}else if(message.MsgType === 'text'){
		ctx.body = message.Content
	}else if(message.MsgType === 'image'){
		ctx.body = {
			type: 'image',
			mediaId: message.MediaId
		}
	}else if(message.MsgType === 'voice'){
		ctx.body = {
			type: 'voice',
			mediaId: message.MediaId
		}
	}else if(message.MsgType === 'location'){
		ctx.body = message.Label
	}
}