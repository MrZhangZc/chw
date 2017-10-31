import request from 'request-promise'
import { sign } from './util'

const base = 'https://api.weixin.qq.com/cgi-bin/'
const api = {
	accessToken: base + 'token?grant_type=client_credential',
	ticket: base + 'ticket/getticket?',
	menu: {
		create: base + 'menu/create?',
		get:    base + 'menu/get?',
		del: base + 'menu/delete?',
		addConditional: base + 'menu/addconditional?',
		delConditional: base + 'menu/delconditional?',
		getInfo: base + 'get_current_selfmenu_info?'
	}
}

export default class Wechat {
	constructor(opts) {
		this.opts = Object.assign({}, opts)

		this.appID = opts.appID
		this.appSecret = opts.appSecret
		this.getAccessToken = opts.getAccessToken
		this.saveAccessToken = opts.saveAccessToken
		this.getTicket = opts.getTicket
		this.saveTicket = opts.saveTicket

		this.fetchAccessToken()
		this.fetchTicket()
	}

	async request(options){
		options = Object.assign({}, options, {json: true})

		try {
			const response = await request(options)
			return response
		}catch(error) {
			console.error(error)
		}
	}

	async fetchAccessToken() {
		let data = await this.getAccessToken()

		if(!this.isValidToken(data, 'access_token')){
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

	async fetchTicket() {
		let zzc = await this.fetchAccessToken()
		let token = zzc.access_token
		let data = await this.getTicket()

		if(!this.isValidToken(data, 'ticket')){
			data =  await this.updateTicket(token)
		}

		await this.saveTicket(data)

		return data
	}

	async updateTicket(token) {
		const url = api.ticket + 'access_token=' + token + '&type=jsapi'

		let data = await this.request({url: url})
		const now = (new Date().getTime())
		const expirseIn = now + (data.expirse_in - 20) * 1000

		data.expirse_in = expirseIn

		return data
	}

	isValidToken(data, name){
		if(!data || !data[name] || !data.expirse_in){
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

	async handle (operation, ...args){
		const tokenData = await this.fetchAccessToken()
		const options = this[operation](tokenData.access_token, ...args)
		const data = await this.request(options)

		return data
	}

	createMenu (token, menu){
		const url = api.menu.create + 'access_token=' + token

		return {method: 'POST', url: url, body: menu}
	}

	getMenu (token){
		const url = api.menu.get + 'access_token=' + token

		return {url: url}
	}

	delMenu (token){
		const url = api.menu.del + 'access_token=' + token

		return {url: url}
	}

	addconditionMenu (token, menu, rule){
		const url = api.menu.addConditional + 'access_token=' + token

		const form = {
			button: menu,
			matchrule: rule
		}

		return {method: 'POST', url: url, body: form}
	}

	delconditionMenu (token, menuId){
		const url = api.menu.delConditional + 'access_token=' + token

		const form = {
			menuid: menuId
		}

		return {method: 'POST', url: url, body: form}
	}

	getCurrentMenuInfo (token){
		const url = api.menu.getInfo + 'access_token=' + token

		return {url: url}
	}

	sign (ticket, url){
		return sign(ticket, url)
	}
}