/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */                       
function Camera(scene, renderer){
    this.perspevtiveCamera;
    this.orthographicCamera;
    this.isPerspective = true;
    this.scene = scene;
    this.renderer = renderer;

    this.initialize = function(){
        this.perspevtiveCamera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
        var frustumSize = 20;
        this.orthographicCamera = new THREE.OrthographicCamera( frustumSize / - 2, frustumSize / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000 );
    };
    this.initialize();
    this.switch = function(){
        if(this.isPerspective){
            this.isPerspective = false;
        }else{      
            this.isPerspective = true;
        }      
    };

    this.update = function(cameraX, cameraY, cameraZ){
        if(this.isPerspective){
            this.perspevtiveCamera.position.set(cameraX, cameraY, cameraZ);
            this.perspevtiveCamera.lookAt(new THREE.Vector3(cameraX, cameraY, cameraZ - 10));
            this.renderer.render(this.scene, this.perspevtiveCamera);
        }else{//ortho
            this.orthographicCamera.position.set(cameraX, cameraY, cameraZ);
            this.orthographicCamera.lookAt(new THREE.Vector3(cameraX, cameraY, cameraZ - 10));
            this.renderer.render(this.scene, this.orthographicCamera);
        }  
    };

    this.onWindowResize = function(){
        if(this.isPerspective){
            this.onWindowResizePerspective();
        }else{
            this.onWindowResizeOrtho(); 
        }
    };

    this.onWindowResizeOrtho = function() {//not working because of ortho?
        var frustumSize = 20;
        this.orthographicCamera.left   = - frustumSize / 2;
        this.orthographicCamera.right  =   frustumSize / 2;
        this.orthographicCamera.top    =   frustumSize / 2;
        this.orthographicCamera.bottom = - frustumSize / 2;
        this.orthographicCamera.updateProjectionMatrix();
        this.keepAspect();
    };

    this.onWindowResizePerspective = function() {//not working because of ortho?
        this.perspevtiveCamera.aspect = window.innerWidth / window.innerHeight;
        this.perspevtiveCamera.updateProjectionMatrix();
        this.keepAspect();
    };

    this.keepAspect = function(){
        var width = window.innerWidth;
        var height = window.innerHeight;
        var margin = 10;
        if(width <= height){//make sure canvas doesn't exceed the size of window but keep the aspect 1
            var ratio = window.innerWidth / window.innerHeight;
            this.renderer.setSize(window.innerWidth - margin, window.innerHeight * ratio - margin);
        }else{
            var ratio = window.innerHeight / window.innerWidth;
            this.renderer.setSize(window.innerWidth * ratio - margin, window.innerHeight - margin);
        }
    };
}

