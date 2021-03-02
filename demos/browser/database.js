

class Database {
	table = {
		users: []
	};

	insert(object) {
		this.table.users.push(object)
	}

	insertUser(username, room_name, start_time, end_time){
		this.insert({
			username, room_name, start_time, end_time
		})
	}

	getUsers(){
		return this.table.users;
	}

	getUserByName(username){
		return this.table.users.find((item) => item.username === username);
	}

	leaveUser(username, end_time){
		return this.table.users.find((item) => item.username === username);
	}
}

module.exports = Database;
