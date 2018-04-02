var Request = new XMLHttpRequest();
if (Request.status == 0) {
    Request.open(
        "get",
        "http://jinnik.azurewebsites.net/getJson.php",
        true
    );
    Request.send(null);
    var OpenData;
    var JsonParseData;
    var JasonStringify;
    Request.onload = function() {
        OpenData = Request.responseText;
        JsonParseData = JSON.parse(OpenData);
        SetStation();
    };
} else {
    SetStation();
}


function SetStation() {
    var FreeButton = document.querySelector("#FreeButton");
    var PayButton = document.querySelector("#PayButton");
    var SelecStation = document.querySelector("#SelectStation");
    var ListStation = document.querySelector(".listStation");
    var temp = [];
    var option = "";
    var listStr = "";
    var len = JsonParseData.length;

    //建立免費及投幣式按鈕
    for (var i = 0; i < len; i++) {
        if (temp.indexOf(JsonParseData[i].Charge) < 0) {
            temp.push(JsonParseData[i].Charge);
            if (JsonParseData[i].Charge === "免費") {
                option +=
                    '<button id="FreeButton" type="button" class="btn btn-outline-primary">' +
                    JsonParseData[i].Charge +
                    "</button>";
            } else if (JsonParseData[i].Charge === "投幣式") {
                option +=
                    '<button id="PayButton" type="button" class="btn btn-outline-warning">' +
                    JsonParseData[i].Charge +
                    "</button>";
            }
            console.log(JsonParseData[i].Charge);
        }
    }
    SelecStation.innerHTML = option;

    function setlist(e) {
        initMap();

        let allLatLngPromise = getAllLatLngPromise();
        console.log(allLatLngPromise);

        axios
        //發送axios取得的資料
            .all(allLatLngPromise)
            //將結果命名成一個變數allResponse
            .then(function(allResponse) {
                //解析結果放入latlngs的集合中
                let latlngs = allResponse.map(function(v, i, a) {
                    console.log("i:", i, v.data);
                    if (v.data.status == "OK") {
                        var lat = v.data.results[0].geometry.location.lat;
                        var lng = v.data.results[0].geometry.location.lng;
                        var address = JsonParseData[i].Address;
                        return {
                            address,
                            lat,
                            lng
                        };
                    }
                    return null;
                });

                console.log(latlngs);

                for (let i = 0; i < latlngs.length; i++) {
                    let data = latlngs[i];
                    var SelectTargetAddress = e.target.innerText;
                    if (SelectTargetAddress === JsonParseData[i].Charge) {
                        var iconImg = "";
                        if (JsonParseData[i].Charge === "免費") {
                            iconImg = "free.png";
                        } else {
                            iconImg = "get-money.png";
                        }
                        var icon = iconImg;
                        if (data) {
                            let marker = new google.maps.Marker({
                                position: { lat: data.lat, lng: data.lng },
                                map: map,
                                title: data.address,
                                icon: icon
                            });
                        }
                    }
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    SelecStation.addEventListener("click", setlist, true);
}
//加入map索引
function getAllLatLngPromise() {
    return JsonParseData.map(function(v, i, a) {
        //用axios取得地理編碼轉換格式
        return axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
            params: {
                address: v.Address,
                key: "AIzaSyDQRMNQ09S5YJoGUhkHiMHhbIJSCZFj42M",
                sensor: "false",
                language: "zh-TW"
            }
        });
    });
}

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: 22.639011, lng: 120.304706 },
        styles: [
            { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
            {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }]
            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }]
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }]
            },
            {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }]
            },
            {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }]
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }]
            },
            {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }]
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }]
            },
            {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }]
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }]
            },
            {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }]
            }
        ]
    });
}