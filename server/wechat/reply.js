const tip = '再次开发一波'

export default async (ctx, next) => {
	const message = ctx.weixin

	//console.log(message)

	ctx.body = tip
}