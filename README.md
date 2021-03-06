# DevOps with Kubernetes
Exercises for the course from University of Helsinki (TKT21027)

## Exercise 3.06 - DBaaS vs DIY
### Database as a Service
#### Pros
- Easy setup, no heavy IT/database team necessary
- Rich integration into vendor ecosystem (administrative tooling, etc.)
- Scalability
- Conformeed to regional legal regulations
- Easy backup automation within the ecosytem

#### Cons
- Cost at scale
- Lack of fine grain control
- Vendor lock-in
- Limited backup options

### DIY Database
#### Pros
- Full control
- Better cost optimization at scale (requires skillful configuration)
- Freedom to set up personal backup channels however we want

#### Cons
- Higher complexity
- More costly when considering configuration/management costs especially at smaller scale
- More manual configurations for backups
- Requires own efforts to conform to legal regulations

## Exercise 3.07 - DB Choice
Final choice: **DIY Postgres Database**  
Reason: Keep existing configuration, avoid changing secrets.

## Exercise 3.10 - New TODO Log
![image](https://user-images.githubusercontent.com/15126801/180514666-72bf03d8-5ee1-43e1-a994-3ddee11bad11.png)

## Exercise 4.03 - Prometheus Query
`count(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"})`
