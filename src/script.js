import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DirectionalLightHelper, MeshStandardMaterial } from 'three'

//Loaders
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(()=>
        {
            material.color.set(parameters.materialColor)
            particlesMaterial.color.set(parameters.materialColor)
        })

// //Texture
// const textureLoader = new THREE.TextureLoader()
// const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
// gradientTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Environment Map
// const environmentmap = cubeTextureLoader.load( [
//     '/textures/environmentMaps/2/px.jpg',
//     '/textures/environmentMaps/2/nx.jpg',
//     '/textures/environmentMaps/2/py.jpg',
//     '/textures/environmentMaps/2/ny.jpg',
//     '/textures/environmentMaps/2/pz.jpg',
//     '/textures/environmentMaps/2/nz.jpg',
// ])
// environmentmap.encoding = THREE.sRGBEncoding
// scene.background = environmentmap
// scene.environment = environmentmap

//Update all Materials

const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {   
        console.log(child.children)
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            
            // child.material.envMap = environmentmap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true

        }
    })
}

//Model loader
const model = gltfLoader.load('/models/Self-3d-website-1.glb', 
    (gltf) =>
    {
        gltf.scene.scale.set(0.3,0.3,0.3)
        gltf.scene.position.set(2,0,0)
        gltf.scene.rotation.y = Math.PI *  0.35 
        scene.add(gltf.scene)

        // gui
        //     .add(gltf.scene.rotation, 'y')
        //     .min(-Math.PI)
        //     .max(Math.PI)
        //     .step(0.001)
        //     .name('rotation')
        // updateAllMaterials()
    }
)

updateAllMaterials()

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial({ color: '#ff0000' })
// )
// scene.add(cube)

//Meshes
const objectsDistance = 4
// const material = new THREE.MeshToonMaterial({
//     color: parameters.materialColor,
//     gradientMap: gradientTexture
// })
// const mesh1 = new THREE.Mesh(
//     new THREE.TorusGeometry(1, 0.4, 16, 60),
//     material
// )

// const mesh2 = new THREE.Mesh(
//     new THREE.ConeGeometry(1,2, 32),
//     material
// )

// const mesh3 = new THREE.Mesh(
//     new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
//     material
// )

// mesh1.position.y = - (objectsDistance * 0)
// mesh2.position.y = -(objectsDistance * 1)
// mesh3.position.y = -(objectsDistance * 2)

// mesh1.position.x = 2
// mesh2.position.x = -2
// mesh3.position.x = 2


// scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [model]

//Particles
// const particlesCount = 200
// const positions = new Float32Array(particlesCount * 3)

// for(let i = 0; i < particlesCount; i++)
// {
//     positions[i * 3 + 0] = (Math.random() - 0.5) * 10
//     positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 3
//     positions[i * 3 + 2] = (Math.random() - 0.5) * 10
// }

// const particlesGeometry = new THREE.BufferGeometry()
// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// //Material
// const particlesMaterial = new THREE.PointsMaterial({
//     color: parameters.materialColor,
//     sizeAttenuation: true,
//     size: 0.03
// })

// //Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)

//Lights
// const lights = {}
// scene.traverse((child) =>
// {
//     if (child.children.type === 'Group')
//     {
//         console.log(child.children)  
//     }
//     // console.log(child.children)
// })

const directionalLight = new THREE.AmbientLight('#ffffff', 2)
const rightLight = new THREE.DirectionalLight('#ffffff', 3)
// const helper = new THREE.DirectionalLightHelper(directionalLight)
rightLight.position.set(-200,-80,250)
scene.add(directionalLight, rightLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Camera Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Scroll
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY/sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x:'+= 6',
                y: '+=3',
                z: '+= 1.5'
            }
        )
        // console.log("changed", currentSection)

    }
})

//Cursor
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', () =>
{
    cursor.x = event.clientX/sizes.width - 0.5
    cursor.y = event.clientY/sizes.height - 0.5
    // console.log(cursor)
})
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Animate camera
    camera.position.y = - (scrollY/sizes.height * objectsDistance)

    const parallaxX = cursor.x 
    const parallaxY = - cursor.y 
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime

    // //Animate meshes
    // for (const mesh of sectionMeshes)
    // {
    //     mesh.rotation.x += deltaTime * 0.1
    //     mesh.rotation.y += deltaTime * 0.12
    // }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()