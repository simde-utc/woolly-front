import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';

@JsonApiModelConfig({ type: 'usertypes' })
export class UserType extends JsonApiModel {
	@Attribute() name: string;
}

@JsonApiModelConfig({ type: 'users' })
export class User extends JsonApiModel {
	@Attribute() email: string;
	@Attribute() first_name: string;	
	@Attribute() last_name: string;
	@Attribute() type: string;
	@BelongsTo() usertype: UserType;
}