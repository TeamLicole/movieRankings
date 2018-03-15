var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    priority: '',
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	       return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	     return this.items.filter(function(item) {
	        return !item.completed;
	      });
      if (this.show === 'completed')
	     return this.items.filter(function(item) {
         return item.completed;
	     });
      return this.items;
    },
    created: function() {
      this.getItems();
    },
  },
  methods: {
    addItem: function() {
      if (this.priority === "1") {
       this.priority = 1;
      }
      else if (this.priority === "2") {
       this.priority = 2;
      }
      else if (this.priority === "3") {
        this.priority = 3;
      }
      axios.post("http://localhost:3000/api/items", {
      	text: this.text,
        priority: this.priority,
      	completed: false
      }).then(response => {
      	this.text = "";
        this.priority = "";
      	this.getItems();
      	return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
     axios.put("http://localhost:3000/api/items/" + item.id, {
       text: item.text,
       completed: !item.completed,
       priority: item.priority,
       orderChange: false,
       sortBool: false,
     }).then(response => {
       return true;
     }).catch(err => {
     });
   },
   priorityUp: function(item) {
     if (item.priority < 3) {
       item.priority++;
     }
     axios.put("http://localhost:3000/api/items/" + item.id, {
       text: item.text,
       completed: item.completed,
       priority: item.priority,
       orderChange: false,
       sortBool: false,
     }).then(response => {
       return true;
     }).catch(err => {
     });
    },
   priorityDown: function(item) {
      if (item.priority > 1) {
        item.priority--;
      }
      axios.put("http://localhost:3000/api/items/" + item.id, {
        text: item.text,
        completed: item.completed,
        priority: item.priority,
        orderChange: false,
        sortBool: false
      }).then(response => {
        return true;
      }).catch(err => {
      });
   },
   deleteItem: function(item) {
      axios.delete("http://localhost:3000/api/items/" + item.id).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   showAll: function() {
      this.show = 'all';
   },
   showActive: function() {
      this.show = 'active';
   },
   showCompleted: function() {
      this.show = 'completed';
   },
   deleteCompleted: function() {
      this.items.forEach(item => {
      	if (item.completed)
      	  this.deleteItem(item)
      });
   },
   sort: function() {
      var counter = 0;
      counter = this.sortLoop(1, counter);
      counter = this.sortLoop(2, counter);
      counter = this.sortLoop(3, counter);
   },
   sortLoop: function(value, counter) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].priority == value) {
          console.log(counter, ": ", value, ", ", this.items[i].id);
          this.sortMove(this.items[i], counter);
          counter++;
        }
      }
      return counter;
   },
   sortMove: function(item, counter) {
      axios.put("http://localhost:3000/api/items/" + item.id, {
      	text: item.text,
      	completed: item.completed,
        priority: item.priority,
      	orderChange: true,
        sortBool: true,
      	orderTarget: counter
      }).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   dragItem: function(item) {
      this.drag = item;
   },
   dropItem: function(item) {
      axios.put("http://localhost:3000/api/items/" + this.drag.id, {
      	text: this.drag.text,
      	completed: this.drag.completed,
        priority: this.drag.priority,
      	orderChange: true,
        sortBool: false,
      	orderTarget: item.id
      }).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   getItems: function() {
      axios.get("http://localhost:3000/api/items").then(response => {
      	this.items = response.data;
      	return true;
      }).catch(err => {
      });
   },
  }
});
