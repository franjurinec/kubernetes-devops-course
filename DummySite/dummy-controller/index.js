const k8s = require('@kubernetes/client-node');
const JSONStream = require('json-stream');
const request = require('request')

const init = async () => {
    const kc = new k8s.KubeConfig()
    process.env.NODE_ENV === 'development' ? kc.loadFromDefault() : kc.loadFromCluster()

    console.log(kc)

    const deploymentApi = kc.makeApiClient(k8s.AppsV1Api)
    const serviceApi = kc.makeApiClient(k8s.CoreV1Api)
    const ingressApi = kc.makeApiClient(k8s.NetworkingV1Api)

    const stream = new JSONStream()
    stream.on('data', async ({ type, object }) => {
        // New DummySite resource created
        if (type === 'ADDED') {
            
            // Relevant data
            const fields = {
                name: object.metadata.name,
                namespace: object.metadata.namespace,
                website_url: object.spec.website_url,
                image: object.spec.image
            }
    
            // Create Deployment
            await deploymentApi.createNamespacedDeployment(fields.namespace, {
                apiVersion: 'apps/v1',
                kind: 'Deployment',
                metadata: {name: `${fields.name}-dep`},
                spec: {
                    selector: { matchLabels: { app: fields.name } },
                    template: {
                        metadata: { labels: { app: fields.name } },
                        spec: {
                            containers: [{
                                name: 'dummysite-app',
                                image: `${fields.image}`,
                                env: [{
                                    name: 'WEBSITE_URL',
                                    value: fields.website_url
                                }]
                            }]
                        }
                    }
                }}).catch(error => console.error(error))
            
            // Create Service
            await serviceApi.createNamespacedService(fields.namespace, {
                apiVersions: 'v1',
                kind: 'Service',
                metadata: { name: `${fields.name}-svc` },
                spec: {
                    type: 'ClusterIP',
                    selector: {
                        app: fields.name,
                    },
                    ports: [{
                        port: 80,
                        protocol: 'TCP',
                        targetPort: 3000,
                    }]
                }}).catch(error => console.error(error))
    
            // Create Ingress
            await ingressApi.createNamespacedIngress(fields.namespace, {
                apiVersion: 'networking.k8s.io/v1',
                kind: 'Ingress',
                metadata: { name: `${fields.name}-ing` },
                spec: { rules: [{ http: { paths: [{
                                backend: {
                                    serviceName: `${fields.name}-svc`,
                                    servicePort: 80
                                },
                                path: '/',
                            }]}}]
                }}).catch(error => console.error(error))
    
        }
    })


    const opts = {};
    kc.applyToRequest(opts);
    
    (await serviceApi.listPodForAllNamespaces()).body

    request.get(`${kc.getCurrentCluster().server}/apis/stable.dwk/v1/dummysites?watch=true`, opts).pipe(stream)        
}

init()
