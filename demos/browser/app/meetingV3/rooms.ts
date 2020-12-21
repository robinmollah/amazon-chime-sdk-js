// import {AsyncScheduler} from "../../../../src";


export function initRoomListeners(obj: any){
	// let room1: string = "room_1_1";
	// let room2: string = "room_1_2";
	// let room3: string = "room_1_3";
	//
	// const room_1 = document.getElementById("to_room_1");
	// room_1.addEventListener('click', (e) => {
	// 	if(obj.meeting == room1) return;
	// 	leave(obj);
	// 	obj.meeting = room1;
	// 	console.log("Meeting changed");
	// 	refresh(obj, obj.meeting);
	// });
	//
	// const room_2 = document.getElementById("to_room_2");
	// room_2.addEventListener('click', (e) => {
	// 	if(obj.meeting == room2) return;
	// 	leave(obj);
	// 	obj.meeting = room2;
	// 	console.log("Meeting changed");
	// 	refresh(obj, obj.meeting);
	// });
	//
	// const room_3 = document.getElementById("to_room_3");
	// room_3.addEventListener('click', (e) => {
	// 	if(obj.meeting == room3) return;
	// 	leave(obj);
	// 	obj.meeting = room3;
	// 	console.log("Meeting changed");
	// 	refresh(obj, obj.meeting);
	// });
	//
	// const refresh = (obj: any, meeting: string) => {
	//
	// 	clearRosters();
	//
	// 	new AsyncScheduler().start(async () => {
	// 		this.meeting = meeting;
	// 		this.name = obj.isRecorder() ? '«Meeting Recorder»' : 'user_' + Math.floor(Math.random() * 100);
	// 		await obj.authenticate();
	// 		await obj.join();
	// 		obj.displayButtonStates();
	// 		obj.switchToFlow('flow-meeting');
	// 		obj.updateRoster();
	// 	});
	// }
	//
	// const clearRosters = () => {
	// 	const roster = document.getElementById('roster');
	//
	// 	while(roster.getElementsByTagName("li").length > 0){
	// 		roster.removeChild(roster.getElementsByTagName('li')[0]);
	// 	}
	// }
	//
	// const leave = async (obj: any) => {
	// 	obj.audioVideo.chooseAudioInputDevice(null);
	// }
}
