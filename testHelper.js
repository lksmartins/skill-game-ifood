import * as express from 'express'
import App from '../../app'

export default class IntegrationHelpers {
	static appInstance = express.Application
	static async getApp(){
		if (this.appInstance) {
			console.log('already has appInstance')
			return this.appInstance
		}
		const app = new App()
		return await app.init().then(()=>{
			console.log('new appInstance')
			this.appInstance = app.express
			return this.appInstance
		})
	}
}