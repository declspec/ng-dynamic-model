import { RequiredValidator } from './required';

ValidationConfig.$inject = [ 'ValidatorFactoryProvider' ];
export function ValidationConfig(provider) {
    provider.register('required', RequiredValidator);
}