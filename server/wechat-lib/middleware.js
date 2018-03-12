import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'

export default function(opts, reply) {
	return async function wechatMiddle(ctx, next){
		const token = opts.token
		const {
			signature,
			nonce,
			timestamp,
			echostr
		} = ctx.query

		const str = [token, timestamp, nonce].sort().join('')
		const sha = sha1(str)
		console.log(sha === signature)

		if(ctx.method === 'GET'){
			if( sha === signature ){
				ctx.body = echostr
			}else{
				ctx.body = 'Filed'
			}
		}else if(ctx.method === 'POST'){
			if( sha !== signature ){
				ctx.body = 'Filed'
				
				return false
			}


			const data = await getRawBody(ctx.req, {
				length: ctx.length,
				limit:  '1mb',
				encoding: ctx.charset
			})

			const content = await util.parseXML(data)
			const message = util.formatMessage(content.xml)

			console.log('content:',content)
			console.log('message:',message)

			ctx.weixin = message

			await reply.apply(ctx, [ctx, next])

			const replyBody = ctx.body
			const msg = ctx.weixin

			const xml = util.tpl(replyBody, msg)

			ctx.stats = 200
			ctx.type  = 'application/xml'
			ctx.body  = xml
		}
	}
}