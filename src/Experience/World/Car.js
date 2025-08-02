import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import Experience from '../Experience.js'
import CarModel from './CarModel.js'
import CarController from './CarController.js'
import CarPhysics from './CarPhysics.js'

let instance = null

export default class Car {
    constructor() {
        // Singleton

        if (instance) {
            return instance
        }

        instance = this

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.camera = this.experience.camera.instance
        //console.log(this.camera)
        this.carModel = new CarModel()
        this.carControllers = new CarController()
        this.carPhysics = new CarPhysics()

        this.vehicle = this.carPhysics.vehicle

        this.time = this.experience.time
        this.debug = this.experience.debug

        this.frontWheelMesh1 = this.carModel.frontWheelMesh1
        this.frontWheelMesh2 = this.carModel.frontWheelMesh2
        this.rearWheelMesh1 = this.carModel.rearWheelMesh1
        this.rearWheelMesh2 = this.carModel.rearWheelMesh2
        this.chassisMesh = this.carModel.chassisMesh

        if (this.debug.active) {
            this.debugFolder = this.debug.gui.addFolder('car')
            this.setupCameraDebug()
        }

        this.initChaseCamera()
    }

    initChaseCamera() {
        this.chaseCamera = new THREE.Object3D()
        this.chaseCameraPivot = new THREE.Object3D()
        this.view = new THREE.Vector3()
        this.lookAtTarget = new THREE.Vector3()

        this.chaseCamera.position.set(0, 0, 0)
        this.chaseCameraPivot.position.set(0, -14, 4)
        this.chaseCamera.add(this.chaseCameraPivot)
        this.scene.add(this.chaseCamera)

        // Don't attach directly to chassis mesh to avoid rigid following
    }

    setupCameraDebug() {
        this.cameraParams = {
            x: 0,
            y: -14,
            z: 4,
            lookAtOffsetY: 1,
            positionLerp: 0.08,
            lookAtLerp: 0.1,
            chaseLerp: 0.05
        }

        const cameraFolder = this.debugFolder.addFolder('Chase Camera')
        
        cameraFolder.add(this.cameraParams, 'x', -20, 20, 0.1).onChange(() => {
            this.chaseCameraPivot.position.x = this.cameraParams.x
        })
        
        cameraFolder.add(this.cameraParams, 'y', -20, 10, 0.1).onChange(() => {
            this.chaseCameraPivot.position.y = this.cameraParams.y
        })
        
        cameraFolder.add(this.cameraParams, 'z', -20, 20, 0.1).onChange(() => {
            this.chaseCameraPivot.position.z = this.cameraParams.z
        })
        
        cameraFolder.add(this.cameraParams, 'lookAtOffsetY', -2, 5, 0.1)
        cameraFolder.add(this.cameraParams, 'positionLerp', 0.01, 0.5, 0.01)
        cameraFolder.add(this.cameraParams, 'lookAtLerp', 0.01, 0.5, 0.01)
        cameraFolder.add(this.cameraParams, 'chaseLerp', 0.01, 0.3, 0.01)
    }


    updateChaseCamera() {
        if (this.chassisMesh) {
            // Use debug parameters if available
            const chaseLerp = this.cameraParams ? this.cameraParams.chaseLerp : 0.05
            const positionLerp = this.cameraParams ? this.cameraParams.positionLerp : 0.08
            const lookAtLerp = this.cameraParams ? this.cameraParams.lookAtLerp : 0.1
            const lookAtOffsetY = this.cameraParams ? this.cameraParams.lookAtOffsetY : 1

            // Smoothly update chase camera position to follow car
            this.chaseCamera.position.lerp(this.chassisMesh.position, chaseLerp)
            this.chaseCamera.rotation.copy(this.chassisMesh.rotation)
            
            // Apply camera parameters
            if (this.cameraParams) {
                this.chaseCameraPivot.position.set(this.cameraParams.x, this.cameraParams.y, this.cameraParams.z)
            }
            
            // Get smooth camera position
            this.chaseCameraPivot.getWorldPosition(this.view)

            if (this.view.y < 1) {
                this.view.y = 1
            }

            // Smooth camera position interpolation
            this.camera.position.lerp(this.view, positionLerp)
            
            // Look at a point slightly ahead of the car
            const lookAtPoint = this.chassisMesh.position.clone()
            lookAtPoint.y += lookAtOffsetY
            this.lookAtTarget.lerp(lookAtPoint, lookAtLerp)
            this.camera.lookAt(this.lookAtTarget)
        }
    }

    update() {
        /*
         * Note: The rotation of the chassisMesh is necessary. 
         * For some reason, the mesh comes pre-rotated by 90 degrees on the x-axis.
         */

        if (this.chassisMesh) {
            this.carModel.updateMeshPosition(this.chassisMesh, this.vehicle.chassisBody)
            this.chassisMesh.rotateX(-Math.PI / 2)
        }

        if (this.frontWheelMesh1) {
            this.carModel.updateMeshPosition(this.frontWheelMesh1, this.vehicle.wheelBodies[2])
        }

        if (this.frontWheelMesh2) {
            this.carModel.updateMeshPosition(this.frontWheelMesh2, this.vehicle.wheelBodies[3])
        }

        if (this.rearWheelMesh1) {
            this.carModel.updateMeshPosition(this.rearWheelMesh1, this.vehicle.wheelBodies[0])
        }

        if (this.rearWheelMesh2) {
            this.carModel.updateMeshPosition(this.rearWheelMesh2, this.vehicle.wheelBodies[1])
        }

        this.updateChaseCamera()

    }
}