## VersaLink VL6180 proximity / distance  sensor device driver

This device driver is specifically designed to be used with the Agilatech® VersaLink IIoT Platform.
Please see [agilatech.com](https://agilatech.com/software) to download a copy of the system. 


### Install
```
$> npm install @agilatech/versalink-vl6180-device
```


### Design
This device driver is designed for both streaming and periodic monitored data collection from the VL6180 sensor.

The VL6180X precisely measures the time the light takes to travel to the nearest object and reflect back to the sensor (Time-of-Flight).  In addition to the proximity sensor, it also includes an ambient light sensor.

Although VersaLink can run on most any operating system, this driver uses Linux-specific protocols, so it will not work directly on Windows.


### Usage
This device driver is designed to be consumed by the Agilatech® VersaLink IIoT system.  As such, it is not really applicable or useful in other environments.

To use it with VersaLink, insert its object definition as an element in the devices array in the _devlist.json_ file.
```
{
  "name": "VL6180",
  "module": "@agilatech/versalink-vl6180-device",
  "options": {
    "devicePoll": 1000,
    "streamPeriod": 60000
  }
}
```


#### Device config object
The device config object is an element in the devlist.json device configuration file, which is located in the VersaLink root directory.  It is used to tell the VersaLink system to load the device, as well as several operational parameters.

_name_ is simply the name given to the device.  This name can be used in queries and for other identifcation purposes.

_module_ is the name of the npm module. The module is expected to exist in this directory under the _node_modules_ directory.  If the module is not strictly an npm module, it must still be found under the node_modules directory.

_options_ is an object within the device config object which defines all other operational parameters.  In general, any parameters may be defined in this options object, and most modules will have many several.  The three which are a part of every VersaLink device are 'devicePoll', 'streamPeriod', and 'deltaPercent'. The vl6180 options also can define the bus device file.  Finally, all parameter values can have a range defined by specifying '<parameter>\_range'.

```
"streamPeriod":<period>
Period in milliseconds for broadcast of streaming values

"devicePoll":<period>
Period in milliseconds in which device will be polled to check for new data

"deltaPercent":<percent>
Percent of the data range which must be exceeded (delta) to qualify as "new" data

"bus":<linux bus device>
Linux filesystem device for hardware bus, i.e. /dev/i2c-1
```
#### devicePoll and streamPeriod
_devicePoll_ is given in milliseconds, and defines how often the device will be polled for new values.  This paramter is primary useful in sensors which sit idle waiting to be polled, and not for devices which supply values on their own schedule (i.e. for pull ranther that push).

_streamPeriod_ is also given in milliseconds, and defines how often the device will publish its values on the data stream.  Streaming is disabled if this parameter is set to 0. 


#### deltaPercent explained
_deltaPercent_ is the percentage of the current numerical data range which a polled data value must exceed to be considred "new". As an example, consider a temperature range of 100, a deltaPercent of 2, and the current temerature of 34.  In such a case, a device poll must produce a value of 36 or greater, or 32 or less than in order to be stored as a current value.  35 or 33 will be ignored.  deltaPercent may be any value greater than 0 or less than 100, and may be fractional. If not defined, the default is 5 percent.


#### Defining the value ranges
Value ranges may also be defined in the config, and are closely related to deltaPercent.  If not defined, the software will keep track of minimum and maximum values and derive the range from them.  However, that takes time for the software to "learn" the ranges, so they can be defined in the config object:
```
"range_range":<numeric range>
"lux_range":<numeric range>
```
where the &lt;numeric range&gt; is a number representing the absolute range of the value.

#### module config 
Every module released by Agilatech includes configuration in a file named 'config.json' and we encourage any other publishers to follow the same pattern.  The parameters in this file are considered defaults, since they are overriden by definitions appearing in the options object of the VersaLink devlist.json file.

The construction of the config.json mirrors that of the options object, which is simply a JSON object with key/value pairs.
Here is an example of an 'config.json' file which streams values every 10 seconds, polls the device every second, requires an 8% delta change to register a new monitored value, and defines valid ranges on all parameters:
```
{
    "streamPeriod":10000, 
    "devicePoll":1000, 
    "deltaPercent":8,
    "range_range":100
}
```

  
#### Default values
If not specified in the config object, the program uses the following default values:
* _streamPeriod_ : 10000 (10,000ms or 10 seconds)
* _devicePoll_ : 1000 (1,000ms or 1 second)
* _deltaPercent_ : 5 (polled values must exceed the range by &plusmn; 5%)
* _bus_ : /dev/i2c-1


### Properties
All drivers contain the following 4 core properties:
1. **state** : the current state of the device, containing either the value *chron-on* or *chron-off* 
to indicate whether the device is monitoring data isochronally (a predefinied uniform time period of device data query).
2. **id** : the unique id for this device.  This device id is used to subscribe to this device streams.
3. **name** : the given name for this device.
4. **type** : the given type category for this device,  (_sensor_, _actuator_, etc)


#### Monitored Properties
In the *on* state, the driver software for this device monitors two values.
1. **range** - proximity distance from 0-100 mm
2. **lux** - light value in lux

  
#### Streaming Properties
In the *on* state, the driver software continuously streams two values in isochronal 
fashion with a period defined by *streamPeriod*. Note that a *streamPeriod* of 0 disables streaming.
1. **range_stream**
2. **lux_stream**
  

### State
This device driver has a binary state: __on__ or __off__. When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition. When on, the device is operations and accepts all commands.  The initial state is _off_.
  
  
### Transitions
1. **turn-on** : Sets the device state to *on*. When on, the device is operational and accepts all commands. Values are streamed, and the device is polled periodically to keep monitored values up to date.

2. **turn-off** : Sets the device state to *off*, When off, no parameter values are streamed or available, and no commands are accepted other than the _turn-on_ transition.


### Compatibility
This driver is designed to run within the VersaLink IIoT platform.  While VersaLink will run on nearly any operating system, this driver employs UNIX-specific protocols and as such will run on the following operating systems:
* 32 or 64-bit Linux
* macOS and OS X
* SunOS
* AIX


### Copyright
Copyright © 2018 [Agilatech®](https://agilatech.com). All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

