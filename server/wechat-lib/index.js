import request from 'request-promise'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
	accessToken: base + 'token?grant_type=client_credential'
}

export default class Wechat {
	constructor(opts) {
		this.opts = Object.assign({}, opts)

		this.appID = opts.appID
		this.appSecret = opts.appSecret
		this.getAccessToken = opts.getAccessToken
		this.saveAccessToken = opts.saveAccessToken

		this.fetchAccessToken()
	}

	async request(options){
		options = Object.assign({}, options, {json: true})

		try {
			const response = await request(options)
			console.log(response)
			return response
		}catch(error) {
			console.error(error)
		}
	}

	async fetchAccessToken() {
		let data = await this.getAccessToken()

		if(!this.isValidAccessToken(data)){
			data =  await this.updateAccessToken()
		}

		await this.saveAccessToken(data)

		return data
	}

	async updateAccessToken() {
		const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret

		const data = await this.request({url: url})
		const now = (new Date().getTime())

		const expirseIn = now + (data.expirse_in - 20) * 1000
		data.expirse_in = expirseIn

		return data
	}

	isValidAccessToken(data){
		if(!data || !data.access_token || !expirse_in){
			return false
		}

		const expirseIn = data.expirse_in
		const now = (new Date().getTime())

		if(now < expirseIn){
			return true
		}else{
			return false
		}
	}
}