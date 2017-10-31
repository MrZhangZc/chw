import { getWechat, getOAuth } from '../wechat'

const client = getWechat()

export async function getSignatureAsync(url){
	const data = await client.fetchAccessToken()
	const token = data.access_token
	const ticketData = await client.fetchTicket(token)
	const ticket = ticketData.ticket

	console.log('哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', ticket)

	let params = client.sign(ticket, url)
	params.appId = client.appID

	return params
}

export function getAuthorizeURL(...args){
	const oauth = getOAuth()

	return oauth.getAuthorizeURL(...args)
}

export async function getUserByCode (code) {
	const oauth = getOAuth()
	const data = await oauth.fetchAccessToken(code)

	const user = await oauth.getUserInfo(data.access_token, data.openid)
	console.log('qqqqqqqqqqqq',data)

	return user
}
