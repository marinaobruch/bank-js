import { redQuery } from '@/core/red-query/red-query.lib'
import { NotificationService } from '@/core/services/notification.service'

export class AuthService {
	#BASE_URL = '/auth'

	constructor() {
		// store
    // назначаем экземпляры классов, чтобы их можно было использовать неограниченное количество раз в этом классе
		this.notificationService = new NotificationService()
	}

  // type - login/register, в body - password и email
	main(type, body) {
		return redQuery({
			path: `${this.#BASE_URL}/${type}`,
			body,
			onSuccess: data => {
				// login store
				this.notificationService.show(
					'success',
					'You have successfully logged in!'
				)
			},
			method: 'POST'
		})
	}
}