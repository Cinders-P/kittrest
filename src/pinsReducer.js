export default (state = [], action) => {
	if (action.type === 'REFRESH_PINS' && action.payload) {
		return action.payload;
	}
	return state;
};
