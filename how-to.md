# Getting node-canvas to work on AWS Lambda
- Adapted from [https://github.com/WebSeed/node-canvas-aws-lambda-example/blob/master/NOTES.md](https://github.com/WebSeed/node-canvas-aws-lambda-example/blob/master/NOTES.md)

### 1. Ec2 instance setup
Fire up an EC2 instance (`t2.nano` will do) with the appropriate AMI listed at http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html e.g. for EU (Ireland) search "Community API" for `ami-bff32ccc`.

SSH into the instance e.g.

```
sudo ssh -i your-key-pair.pem ec2-user@ec2-12-34-56-123.eu-west-1.compute.amazonaws.com
```

Install Node.js

```
sudo yum install nodejs npm --enablerepo=epel

```

switch Node.js version to same one as on AWS Lambda (currently v0.10.36):
```
npm install -g n
n 0.10.36
curl -0 -L http://npmjs.org/install.sh | sudo sh
```


```
sudo yum groupinstall "Development Tools"
sudo yum -y install zlib-devel
```

Adapted from [https://github.com/Automattic/node-canvas/wiki/Installation---Amazon-Linux-AMI-%28EC2%29](https://github.com/Automattic/node-canvas/wiki/Installation---Amazon-Linux-AMI-%28EC2%29):

Environment variables:
```
export LDFLAGS=-Wl,-rpath=/var/task/lib/
export PKG_CONFIG_PATH='/canvas/lib/pkgconfig'
export LD_LIBRARY_PATH='/canvas/lib':$LD_LIBRARY_PATH

C_INCLUDE_PATH=/canvas/include/
CPLUS_INCLUDE_PATH=/canvas/include/
export C_INCLUDE_PATH
export CPLUS_INCLUDE_PATH
```

### 2. Building libraries:

```
curl -L http://downloads.sourceforge.net/libpng/libpng-1.6.21.tar.xz -o libpng-1.6.21.tar.xz
tar -Jxf libpng-1.6.21.tar.xz && cd libpng-1.6.21
./configure --prefix=/canvas
make
sudo make install
cd ..

curl http://www.ijg.org/files/jpegsrc.v8d.tar.gz -o jpegsrc.v8d.tar.gz
tar -zxf jpegsrc.v8d.tar.gz && cd jpeg-8d/
./configure --disable-dependency-tracking --prefix=/canvas 
make
sudo make install


curl -L http://www.cairographics.org/releases/pixman-0.34.0.tar.gz -o pixman-0.34.0.tar.gz
tar -zxf pixman-0.34.0.tar.gz && cd pixman-0.34.0/
./configure --prefix=/canvas
make
sudo make install

curl -L http://download.savannah.gnu.org/releases/freetype/freetype-2.6.tar.gz -o freetype-2.6.tar.gz
tar -zxf freetype-2.6.tar.gz && cd freetype-2.6/
./configure --prefix=/canvas
make
sudo make install

curl -L http://cairographics.org/releases/cairo-1.14.6.tar.xz -o cairo-1.14.6.tar.xz
tar -Jxf cairo-1.14.6.tar.xz && cd cairo-1.14.6
./configure --disable-dependency-tracking --without-x --prefix=/canvas
make
sudo make install

curl -L http://downloads.sourceforge.net/giflib/giflib-5.1.3.tar.bz2 -o giflib-5.1.3.tar.bz2
tar -xvjf giflib-5.1.3.tar.bz2 && cd giflib-5.1.3
./configure --prefix=/canvas
make
sudo make install

curl -L http://xmlsoft.org/sources/libxml2-2.9.3.tar.gz -o libxml2-2.9.3.tar.gz
tar -zxf libxml2-2.9.3.tar.gz && cd libxml2-2.9.3
./configure --prefix=/canvas
make
sudo make install


curl -L http://www.freedesktop.org/software/fontconfig/release/fontconfig-2.11.1.tar.bz2 -o fontconfig-2.11.1.tar.bz2
tar -xvjf fontconfig-2.11.1.tar.bz2 && cd fontconfig-2.11.1
./configure --prefix=/canvas  --enable-libxml2
make
sudo make install
```

### 3. Copy compiled libs (with -L option)
```
cp -L /canvas/lib/*.so* /home/ec2-user/tmp/
```
and then put them in `/lib` subfolder of your lambda project on local computer

### 4. Install & Rebuild node canvas module
```
cd /home/ec2-user/canvas-lambda
npm install canvas
cd node_modules/canvas
node-gyp rebuild
```
and then copy canvas module to your lambda project on local computer



## Links

* https://github.com/WebSeed/node-canvas-aws-lambda-example/blob/master/NOTES.md
* https://aws.amazon.com/blogs/compute/nodejs-packages-in-lambda/
* https://github.com/Automattic/node-canvas/issues/680
* https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/
* http://stackoverflow.com/a/34019827/186965
* [https://github.com/Automattic/node-canvas/wiki/Installation---Amazon-Linux-AMI-%28EC2%29](https://github.com/Automattic/node-canvas/wiki/Installation---Amazon-Linux-AMI-%28EC2%29)

## EC2 AMI amzn-ami-hvm-2015.09.1.x86_64-gp2 (Lambda base)
