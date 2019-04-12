import Geolocation from 'Geolocation';

/*API
 *Geolocation.getCurrentPosition 为获取当前定位信息
 *Geolocation.watchPosition 为获取移动位置信息 
 */


// 获取当前定位
let getLongitudeAndLatitude = () => {

    //获取位置再得到城市先后顺序，通过Promise完成
    return new Promise((resolve, reject) => {

        Geolocation.getCurrentPosition(
            location => {

                //可以获取到的数据
                var result = "速度：" + location.coords.speed +
                    "\n经度：" + location.coords.longitude +
                    "\n纬度：" + location.coords.latitude +
                    "\n准确度：" + location.coords.accuracy +
                    "\n行进方向：" + location.coords.heading +
                    "\n海拔：" + location.coords.altitude +
                    "\n海拔准确度：" + location.coords.altitudeAccuracy +
                    "\n时间戳：" + location.timestamp;

                // ToastAndroid.show("UTIl" + location.coords.longitude, ToastAndroid.SHORT);
                resolve([location.coords.longitude, location.coords.latitude]);
            },
            error => {
                console.log("获取位置失败：" + error, "")
                reject(error);
            }
        );
    })
}

//@TODO:是否要把beginWatch和stopWatch函数提出到这里

export { getLongitudeAndLatitude, beginWatchLongitudeAndLatitude, stopWatchLocation }
