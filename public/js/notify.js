document.body.click()
// const Notify = (o)=> {
function Notify(o) {
	// default params
	if (!o) o = {}
	if (!o.corner) o.corner = "top_right";
	if (!o.delay) o.delay = 5000;
	if (!o.maxElem) o.maxElem = 10;
	
	const notifyContainer = document.createElement("div");
	notifyContainer.id = "notifyContainer";
	notifyContainer.className = o.corner;
	document.body.appendChild(notifyContainer);

	const countAlerts = document.getElementsByClassName("alerts");

	this.notifyCreate = (style, head, content, sound) => {
		let alerts = document.createElement("div");
				alerts.className = "alerts";
				alerts.className += " alerts-" + style;
		if (!content) {
			alerts.innerHTML = `<h3>${head}</h3>`;
		} else {
			if (style == 'info') { head = '<i class="fa fa-info-circle"></i> ' + head; }
			if (style == 'success') { head = '<i class="fa fa-check-circle-o"></i> ' + head; }
			if (style == 'warning') { head = '<i class="fa fa-exclamation-circle"></i> ' + head; }
			if (style == 'error') { head = '<i class="fa fa-exclamation-triangle"></i> ' + head; }
			alerts.innerHTML = `<h3>${head}</h3><p>${content}</p>`;
		};
				notifyContainer.appendChild(alerts);
		if (sound) {
			const audio = new Audio('./assets/sound/notification.mp3');
					audio.play();
		}
		setTimeout(function () {
			alerts.classList.toggle("fadeOut");
		}, o.delay - 300);
		setTimeout(function () {
			notifyContainer.removeChild(alerts);
		}, o.delay);
	};

	this.render = (r) => {
		// default params
		if (!r) r = {}
		const exceptionsParam = !r.style || ( r.style != 'info' && r.style != 'success' && r.style != 'error' && r.style != 'warning'); 
		// console.log(`${exceptionsParam} = ${!r.style} || ( ${r.style != 'info'} && ${r.style != 'success'} && ${r.style != 'danger'} && ${r.style != 'warning'})`)
		r.style = exceptionsParam ? 'info' : r.style;
		r.sound = !r.sound ? false : true;
		if (r.head) {
			r.head = r.head;
			r.content = r.content;
		};
		// r.head = !r.head ? '' : r.head;
		// r.content = !r.content ? '' : r.content;
				
		if (countAlerts.length < o.maxElem) {
			this.notifyCreate(r.style, r.head, r.content, r.sound);
		};
	};
};
