var db = new PouchDB('http://localhost:5984/vocabulary');
showWords();

function redrawTodosUI(todos) {
    //var ul = document.getElementById('word-list');
    //ul.innerHTML = '';
    $("#table_div").empty();
    todos.forEach(function(todo) {
        $("#table_div").append("<tr><td>" + todo.doc.fieldA + "</td><td>" + todo.doc.fieldB + "</td></tr>");
        //ul.appendChild(createTodoListItem(todo.doc));
    });
}

function showWords() {
    //Load all docs
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        console.log("Retrieved all document objects:\n");
        console.log(doc);
        console.log("Error while retrieving all docs:\n");
        console.log(err);
        redrawTodosUI(doc.rows);
    });
}

function saveWord() {
    db.post({
        fieldA: document.getElementById("languageA").value,
        fieldB: document.getElementById("languageB").value
    }, function(err, response) {
    });

    showWords();
}

//var myMapFun = {
//    map: function(doc) {
//        	emit(doc.fieldA);
//    }
//};
function myMapFun(direction) {
    var func;
    if (direction == "A") {
        func = {
            map: function(doc) {
                emit(doc.fieldA);
            }
        }
    }
    if (direction == "B") {
        func = {
            map: function(doc) {
                emit(doc.fieldB);
            }
        }
    }

    return func;
}

function queryWord() {
    //in radioA active
    //console.log($('#radioA').hasClass('active')); 
    var direction;
    if ($('#radioA').hasClass('active')) {
        direction = "A";
    }
    if ($('#radioB').hasClass('active')) {
        direction = "B";
    }
    var queryText = document.getElementById("queryBox").value;
    db.query(myMapFun(direction),
            {
                key: queryText,
                include_docs: true
            },
    function(err, result) {
        console.log("Query results:");
        console.log(result);
        redrawTodosUI(result.rows);
        console.log("Error while querying:\n");
        console.log(err);
    }
    );

}

//@field A for fieldA, B for fieldB
function sort(field, descending) {
    db.query(myMapFun(field),
            {
                include_docs: true,
                descending: descending
            },
    function(err, result) {
        console.log("Sort results:");
        console.log(result);
        redrawTodosUI(result.rows);
        console.log("Error while sorting:\n");
        console.log(err);
    }
    );
}
retrieveOneRandom('A');
function retrieveOneRandom(direction) {
    db.allDocs().then(function(res) {
        var ids = res.rows.map(function(row) {
            return row.id;
        });
        var index = Math.floor(Math.random() * ids.length);
        return db.get(ids[index]);
    }).then(function(randomDoc) {
        if (direction === "A") {
            document.getElementById("question").innerHTML = randomDoc.fieldA;
        }
        if (direction === "B") {
            document.getElementById("question").innerHTML = randomDoc.fieldB;
        }
    }).catch(console.log.bind(console));
}

function checkWord() {
    db.query(myMapFun("A"),
            {
                include_docs: true,
                key: document.getElementById("question").innerHTML
            },
    function(err, result) {
        console.log("Checking results:");
        console.log(result);
        document.getElementById("result").innerHTML = "Not known...";
        result.rows.forEach(function(row){
            if (row.doc.fieldB === document.getElementById("checkWordBox").value) {
                document.getElementById("result").innerHTML = "Right!";
            }
        });
        console.log("Error while checking:\n");
        console.log(err);
    }
    );
    
    retrieveOneRandom("A");
}
//$('.btn-group').button();
//$("#table_div").append("<tr><td>" + value + "</td></tr>");