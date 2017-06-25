var extractedMatrix = []; // Global Variable containing extracted matrix: [ID, Name, Major-Cities, Hospitals, Schools, X-Score] for each feature. 
var extractedMatrix_ID = []; // Sorted by Score // [ID, Name, Major-Cities, Hospitals, Schools, X-Score] for each feature.
var myData = []; // Containing all data.
var run_click = 0; // No of clicks on run button
var divTip = [];

// Function for perfoming onload affairs
// A. Change the top padding of the body to the client height (height + vertical padding) of the Nav-Bar.
// B. Load json Data
function onloadAffairs(){
    settleBodyPadding();
	divTip = d3.select("body").append("div") // Creating Tool-Tip Container
				.attr("class", "tooltip")				
				.style("opacity", 0);
    myReadJSON("OregonOut.json");
    if (document.getElementById("RunButton") != null){
        document.getElementById("RunButton").disabled = true;
    }
    return 0;
}

// Function for performing on-resize affairs
function onresizeAffairs(){
    
	settleBodyPadding();
	
	if (document.getElementById("myMapSvg") != null){
		MapUpdate();
	}
	
	if (document.getElementById("myLegendsSvg") != null){
		LegendsPosiUpdate();
	}
    
    return 0;
}

// Function to change the top padding of the body to the client height (height + vertical padding) of the Nav-Bar.
function settleBodyPadding(){
    var Body = document.getElementById("myFullBody");
    var NavBar = document.getElementById("myNavBar");
    Body.style.paddingTop = (NavBar.clientHeight+10)+"px"; // Assigning the top padding to the client height (height + vertical padding) of the Nav-Bar.
    return 0;
}

// Loading json Data. Secondly, calling the data extracter.
function myReadJSON(FileName){
    
    // Loading Data
    d3.json(FileName, function(error,data){
        if(error){
            console.log(error);
        }
        else{
            myData = data;
            console.log(myData);
            var myData2 = myData.features; // Array containing all features along with their info.
            extractedMatrix = exTracter(myData2); // To generate a matrix (array of arrays) containing feature id and corresponding number of schools, hospitals and major cities. 
            document.getElementById("RunButton").style.borderColor = "green";
        }
    });
    
    return 0;
    
}

// Function to generate a matrix (array of arrays) containing feature id, feature name, and corresponding number of schools, hospitals and major cities.
function exTracter(ArrayofObjects){
    var outputMatrix = [];
    for (var i = 0; i < ArrayofObjects.length; i++){
        var inputRow = [0,0,0,0,0,0]; // [ID, Name, Major-Cities, Hospitals, Schools, X-Score]
        var propertyObject = ArrayofObjects[i].properties;
        inputRow[0] = propertyObject.FID; // Feature ID
        inputRow[1] = propertyObject.NAME; // Name of the Feature
        inputRow[2] = propertyObject.Count_; // No. of Major Cities
        inputRow[3] = propertyObject.Count_1; // No. of Hospitals
        inputRow[4] = propertyObject.Count_2; // No. of Schools
        outputMatrix.push(inputRow);
    }
    // console.log(outputMatrix);
    return outputMatrix;
}

// Function to update weight bar when corresponding weight box is changed and vice-versa. Secondly, calculate for and update all 'other' boxes and bars. Thirdly, check for invalid values.
function updateWeight(userChanged,compChanged){
    var giver = document.getElementById(userChanged);
    var taker = document.getElementById(compChanged);
    taker.value = giver.value;
    solveLinear(userChanged);
    negativeCheck();
    return 0;
}

// Function to calculate for and update all 'other' boxes and bars.
function solveLinear(myIDBarFed){
    
    // Setting Up Row 1
    var row1 = [0,0,0];
    if (myIDBarFed=="myHealthBar" || myIDBarFed=="myHealthBox"){
        row1[0]=1;
    }
    else if (myIDBarFed=="myEduBar" || myIDBarFed=="myEduBox"){
        row1[1]=1;
    }
    else if (myIDBarFed=="myEmployBar" || myIDBarFed=="myEmployBox"){
        row1[2]=1;
    }
    
    // Setting up remaining matrix A and R.H.S.(b) from Ax=b
    var row2 = [1,1,1];
    var row3 = [1,-1,0];
    var rhs = [parseFloat(document.getElementById(myIDBarFed).value),100,20];
    var A = [row1,row2,row3];
    // console.log(A);
    // console.log(rhs);
    
    // Solving Ax=b
    var sol = math.lusolve(A,rhs);
    // console.log(sol);
    for (var i = 0; i < sol.length; i++){
        var s = sol[i];
        sol[i] = s[0];
        sol[i] = (parseFloat(sol[i])).toFixed(2);
    }
    // console.log(sol);
    
    if (myIDBarFed=="myHealthBar" || myIDBarFed=="myHealthBox"){
        document.getElementById("myEduBar").value = sol[1];
        document.getElementById("myEduBox").value = sol[1];
        document.getElementById("myEmployBar").value = sol[2];
        document.getElementById("myEmployBox").value = sol[2];
    }
    else if (myIDBarFed=="myEduBar" || myIDBarFed=="myEduBox"){
        document.getElementById("myHealthBar").value = sol[0];
        document.getElementById("myHealthBox").value = sol[0];
        document.getElementById("myEmployBar").value = sol[2];
        document.getElementById("myEmployBox").value = sol[2];
    }
    else if (myIDBarFed=="myEmployBar" || myIDBarFed=="myEmployBox"){
        document.getElementById("myHealthBar").value = sol[0];
        document.getElementById("myHealthBox").value = sol[0];
        document.getElementById("myEduBar").value = sol[1];
        document.getElementById("myEduBox").value = sol[1];
    }
    return 0;
}

// Function to check for invalid values
function negativeCheck(){
    
    var CheckCount = 0;
    
    if (parseFloat(document.getElementById("myEduBox").value) < 0 || parseFloat(document.getElementById("myEduBox").value) > 100){
        document.getElementById("myEduBox").style.backgroundColor="LightCoral";
        document.getElementById("RunButton").disabled = true;
    } else{
        document.getElementById("myEduBox").style.backgroundColor="white";
        CheckCount++;
    }
    if (parseFloat(document.getElementById("myHealthBox").value) < 0 || parseFloat(document.getElementById("myHealthBox").value) > 100){
        document.getElementById("myHealthBox").style.backgroundColor="LightCoral";
        document.getElementById("RunButton").disabled = true;
    } else{
        document.getElementById("myHealthBox").style.backgroundColor="white";
        CheckCount++;
    }
    if (parseFloat(document.getElementById("myEmployBox").value) < 0 || parseFloat(document.getElementById("myEmployBox").value) > 100){
        document.getElementById("myEmployBox").style.backgroundColor="LightCoral";
        document.getElementById("RunButton").disabled = true;
    } else{
        document.getElementById("myEmployBox").style.backgroundColor="white";
        CheckCount++;
    }
    
    if (CheckCount==3){
        document.getElementById("RunButton").disabled = false;
    }
    
    return 0;
}

// Function to reset weight bar and boxes to zero.
function myReset(){
    
    // Resetting Console
    document.getElementById("myHealthBar").value = 0;
    document.getElementById("myHealthBox").value = 0;
    document.getElementById("myEduBar").value = 0;
    document.getElementById("myEduBox").value = 0;
    document.getElementById("myEmployBar").value = 0;
    document.getElementById("myEmployBox").value = 0;
    
    // Reetting Color of Text Boxes in Console
    document.getElementById("myEduBox").style.backgroundColor="white";
    document.getElementById("myHealthBox").style.backgroundColor="white";
    document.getElementById("myEmployBox").style.backgroundColor="white";
    
    // Resetting Rank Table (innerHTML of table elements)
    
    for (var i = 0; i < 5; i++){ // Updating First Five Rank Holders
        var concernedRow = extractedMatrix[i];
        document.getElementById("NameEntry"+i).innerHTML = "N/A";
        document.getElementById("ScoreEntry"+i).innerHTML = "N/A";
    }
    
    var tempIterator = 1000;
    
    for (var i = extractedMatrix.length-1; i > extractedMatrix.length-1-5; i--){
        var concernedRow = extractedMatrix[i];
        document.getElementById("NameEntry"+tempIterator).innerHTML = "N/A";
        document.getElementById("ScoreEntry"+tempIterator).innerHTML = "N/A";
        tempIterator--;
    }
    
    // Diasbling Run Button
    if (document.getElementById("RunButton") != null){
        document.getElementById("RunButton").disabled = true;
    }
    
    // Restoring the Background in #myMap
    document.getElementById("myMapArea").style.backgroundImage = "url('upup.png')";
    
    // Removing Map related SVG Elements
	if (document.getElementById("myMapSvg") != null){
		document.getElementById("myMapSvg").remove();
	}
	if (document.getElementById("myLegendsSvg") != null){
		document.getElementById("myLegendsSvg").remove();
	}
    
    // Reseting global variables
	run_click = 0; // No of clicks on run button
	
	// Updating Legends Table
	for (var i = 0; i < 5; i++){
		document.getElementById("ColorCol"+i).style.backgroundColor = "";
	}
	for (var i = 0; i < 5; i++){
		document.getElementById("RangeCol"+i).innerHTML = "";
	}
	
    return 0;
}

// Function to update results. Executed when Run Button is clicked.
function ResultsUpdate(){
    RankUpdate();
	if (run_click == 0) {
		MapCreate();
		LegendsCreate();
	}
	else {
		MapUpdate();
	}
}

// Function to Update rank
function RankUpdate(){
    
    // Reading Weight Values
    var w1 = document.getElementById("myHealthBar").value;
    var w2 = document.getElementById("myEduBar").value;
    var w3 = document.getElementById("myEmployBar").value;
    
    // Updating X-Scores
    for (var i = 0; i < extractedMatrix.length; i++){
        var concernedRow = extractedMatrix[i]; // [ID, Name, Major-Cities, Hospitals, Schools, X-Score]
        concernedRow[5] = (w1*concernedRow[3] + w2*concernedRow[4] + w3*concernedRow[2])/100; // Updating X-Score. Because by default, X-Score = 0.
    }
	
    // In-place Sorting in the descencing order of X-Score
    extractedMatrix.sort(function(a,b){
        return b[5]-a[5];
    });
    // console.log(extractedMatrix);
	
	// In-place Sorting our extractedMatrix in ascending order of FID (a.k.a. ID)
	extractedMatrix_ID = extractedMatrix.slice(); // Recovering extractedMatrix_ID with updated X-Scores
	extractedMatrix_ID.sort(function(a,b){ // Sorting in ascending order of ID.
		return a[0]-b[0];
    });
    
    // Updating Rank Table (innerHTML of table elements)
    
    for (var i = 0; i < 5; i++){ // Updating First Five Rank Holders
        var concernedRow = extractedMatrix[i];
        document.getElementById("NameEntry"+i).innerHTML = concernedRow[1];
        document.getElementById("ScoreEntry"+i).innerHTML = concernedRow[5].toFixed(2);
    }
    
    var tempIterator = 1000;
    
    for (var i = extractedMatrix.length-1; i > extractedMatrix.length-1-5; i--){
        var concernedRow = extractedMatrix[i];
        document.getElementById("NameEntry"+tempIterator).innerHTML = concernedRow[1];
        document.getElementById("ScoreEntry"+tempIterator).innerHTML = concernedRow[5].toFixed(2);
        tempIterator--;
    }
    
    return 0;
}

// Function to Update/Create Map
function MapCreate(){
    
    // Updating no. of run button clicks
    run_click++;
    
    // Removing container's (#myMap) background-images
    document.getElementById("myMapArea").style.backgroundImage = "none";
    
    // Appending the SVG element to the div type Map Element
    canvas = d3.select("#myMap").append("svg").attr("id","myMapSvg");
	
	// Setting Scaling and Translate for Map
    var ww = document.getElementById("myMapSvg").clientWidth;
    var hh = document.getElementById("myMapSvg").clientHeight;
	
	// Adding adjustment for mobile phones
	var scale_factor = hh*8;
	if (document.body.clientWidth <= 316){
		scale_factor = hh*5;
	} else if (document.body.clientWidth <= 374){
		scale_factor = hh*6.5;
	}
    
    // Selecting Projection
    var projection = d3.geoConicConformal()
                       .parallels([44 + 20 / 60, 46])
                       .rotate([120 + 30 / 60, -43 - 40 / 60]) // https://github.com/veltman/d3-stateplane <==Great Help
                       .scale(scale_factor)
                       .translate([ww / 2, hh / 1.8]);
                       
    // Creating our path generator
    var path = d3.geoPath().projection(projection); // Does all the dirty work of translating that mess of GeoJSON coordinates into even messier messes of SVG path codes. {Chimera|Orieley Book}
	
	// Data Binding Stage
    var group = canvas.selectAll("path")
                    .data(myData.features);	
		
	// Color Scale Updated; earlier it was defined as []
	color = d3.scaleThreshold()
			.domain([1,3,10,20])
			.range(["#ff0000", "#ff8000", "#ffff00","#80ff00","#608000"]);
                
    // Enter Stage
    group.enter()
        .append("path")
        .attr("d",path)
        .attr("class","county")
		.on("mouseover", function(d) {		
            divTip.transition()		
                .duration(200)		
                .style("opacity", .7);		
            divTip.html(d.properties.NAME + "<br/>"  + "X-Score: " + extractedMatrix_ID[d.properties.FID][5].toFixed(2))	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 32) + "px");	
            })					
        .on("mouseout", function(d) {		
            divTip.transition()		
                .duration(500)		
                .style("opacity", 0);	
        });

    // Update Stage
    canvas.selectAll("path").attr("fill",function(d){
                var desired_row = extractedMatrix_ID[d.properties.FID];
                return color(desired_row[5]);
            });
	
    // Exit Stage
    canvas.exit().remove();
	
    return 0;            
}

function MapUpdate(){  // Inefficient way of updating map but 'fitSize' doesnt seem to work due to unknown reasons.
	document.getElementById("myMapSvg").remove();
	MapCreate();
}

function LegendsCreate2(){
	var domain = [1,3,10,20];
	var range = ["#ff0000", "#ff8000", "#ffff00","#80ff00","#608000"];
	var textStrings = ["Less than "+domain[0],domain[0]+" to "+domain[1],domain[1]+" to "+domain[2],domain[2]+" to "+domain[3],"More than "+domain[3]];
	var datos = [];
	for (var i = 0; i < range.length; i++){
		datos.push([range[i],textStrings[i]]);
	}	
	var canvas = d3.select("#myLegends").append("svg").attr("id","myLegendsSvg");
	
	var yOffset = ((document.getElementById("myLegendsSvg").clientHeight/2)-40-10);
	
	// Data Binding Stage
    var legendos = canvas.selectAll(".threshLegends")
                    .data(datos)
					.enter()
					.append("g")
					.attr("class","threshLegends")
					.attr("transform",function(d,i){return "translate("+0+","+(yOffset+(20*i))+")";})
	
	var rectos = legendos
					.append("rect")
					.attr("width",20)
					.attr("height",20)
					.attr("class","legendRects")
					.attr("fill",function(d){return d[0];});
					
	var textos = legendos
					.append("text")
					.attr("class","legendTexts")
					.attr("x", 22)
					.attr("y", 10)
					.attr("dy", ".35em")
					.text(function(d) { return d[1]; });							
					
}

function LegendsPosiUpdate(){
	
	var yOffset = ((document.getElementById("myLegendsSvg").clientHeight/2)-40-10);
	
	var canvas = d3.select("#myLegendsSvg")
	
	var legendos = canvas.selectAll(".threshLegends")
					.attr("class","threshLegends")
					.attr("transform",function(d,i){return "translate("+0+","+(yOffset+(20*i))+")";})
	
}

function LegendsCreate(){
	var domain = [1,3,10,20];
	var range = ["#ff0000", "#ff8000", "#ffff00","#80ff00","#608000"];
	var textStrings = ["Less than "+domain[0],domain[0]+" to "+domain[1],domain[1]+" to "+domain[2],domain[2]+" to "+domain[3],"More than "+domain[3]];
	for (var i = 0; i < range.length; i++){
		document.getElementById("ColorCol"+i).style.backgroundColor = range[i];
	}
	for (var i = 0; i < textStrings.length; i++){
		document.getElementById("RangeCol"+i).innerHTML = textStrings[i];
	}
}