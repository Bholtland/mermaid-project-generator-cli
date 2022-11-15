export function CacheComputed() {
	return function (
		target: object,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		const method = descriptor.get;
		const name = `cachedComputed${propertyKey}`;

		descriptor.get = function () {
			if (target.constructor.prototype[name]) {
				return target.constructor.prototype[name];
			}

			if (method) {
				const computed = method();
				target.constructor.prototype[name] = computed;
				return computed;
			}
		};
	};
}
