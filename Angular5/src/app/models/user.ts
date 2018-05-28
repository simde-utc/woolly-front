import { JsonApiModelConfig, JsonApiModel, Attribute, HasMany, BelongsTo } from 'angular2-jsonapi';

@JsonApiModelConfig({ type: 'usertypes' })
export class UserType extends JsonApiModel {
	@Attribute() name: string;
}

@JsonApiModelConfig({ type: 'users' })
export class User extends JsonApiModel {
	@Attribute() email: string;
	@Attribute() firstname: string;	
	@Attribute() lastname: string;
	@Attribute() type: string;
	@BelongsTo() usertype: UserType;
}