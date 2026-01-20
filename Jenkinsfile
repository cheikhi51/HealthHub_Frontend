pipeline {
  agent any

  tools {
    jdk 'JDK17'
    maven 'Maven3'
    nodejs 'node18'
  }

  environment {
    DOCKERHUB_CREDS = credentials('dockerhub-creds')
    SONAR_PROJECT_KEY_BACKEND = 'backend-app'
    SONAR_PROJECT_KEY_FRONTEND = 'frontend-app'
  }

  stages {

    stage('Checkout') {
      steps {
        dir('backend') {
          git url: 'https://github.com/cheikhi51/HealthHub_Backend.git',
              branch: 'main',
              credentialsId: 'git-creds'
        }
        dir('frontend') {
          git url: 'https://github.com/cheikhi51/HealthHub_Frontend.git',
              branch: 'main',
              credentialsId: 'git-creds'
        }
      }
    }

    stage('Backend Build & Test') {
      steps {
        dir('backend') {
          withCredentials([
            string(credentialsId: 'postgres-db-url', variable: 'DB_URL'),
            string(credentialsId: 'jwt-secret', variable: 'JWT_SECRET'),
            string(credentialsId: 'jwt-expiration', variable: 'JWT_EXPIRATION'),
            usernamePassword(
              credentialsId: 'postgres-db-credentials',
              usernameVariable: 'DB_USERNAME',
              passwordVariable: 'DB_PASSWORD'
            )
          ]) {
            bat '''
              set DB_DRIVER_CLASS_NAME=org.postgresql.Driver
              set DB_URL=%DB_URL%
              set DB_USERNAME=%DB_USERNAME%
              set DB_PASSWORD=%DB_PASSWORD%
              set JWT_SECRET=%JWT_SECRET%
              set JWT_EXPIRATION=%JWT_EXPIRATION%
              mvn clean compile
            '''
          }
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('frontend') {
          bat '''
            npm install
            npm run build
          '''
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQube') {
          dir('backend') {
            bat '''
              mvn sonar:sonar ^
              -Dsonar.projectKey=%SONAR_PROJECT_KEY_BACKEND%
            '''
          }
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        bat '''
          docker build -t mohamed510/healthhub-backend:latest backend
          docker build -t mohamed510/healthhub-frontend:latest frontend
        '''
      }
    }

    stage('Push to Docker Hub') {
      steps {
        bat '''
          echo %DOCKERHUB_CREDS_PSW% | docker login -u %DOCKERHUB_CREDS_USR% --password-stdin
          docker push mohamed510/healthhub-backend:latest
          docker push mohamed510/healthhub-frontend:latest
        '''
      }
    }

    stage('Verify Minikube') {
      steps {
        bat '''
          echo Verifying Minikube cluster...
          kubectl config use-context minikube
          kubectl cluster-info
          kubectl get nodes
        '''
      }
    }

    stage('Deploy to Minikube') {
      steps {
        dir('frontend/Healthhub-k8s') {
          bat '''
            echo Current directory:
            cd
            
            echo Listing Kubernetes files:
            dir
            
            echo Deploying to Minikube...
            kubectl config use-context minikube
            
            echo Applying Secrets...
            kubectl apply -f secret-postgres.yaml
            kubectl apply -f healthhub-backend-secret.yaml
            
            echo Applying ConfigMaps...
            kubectl apply -f config-postgres.yaml
            
            echo Applying PVC...
            kubectl apply -f postgres-pvc.yaml
            
            echo Deploying PostgreSQL...
            kubectl apply -f postgres.yaml
            
            echo Waiting for PostgreSQL to be ready...
            timeout /t 30
            
            echo Deploying Backend...
            kubectl apply -f healthhub-backend.yaml
            
            echo Deploying Frontend...
            kubectl apply -f healthhub-frontend.yaml
            
            echo Waiting for deployments to be ready...
            kubectl rollout status deployment/healthhub-backend-deployment --timeout=5m
            kubectl rollout status deployment/healthhub-frontend-deployment --timeout=5m
            
            echo Deployment completed successfully!
            kubectl get pods
            kubectl get services
          '''
        }
      }
    }

  }

  post {
    success {
      echo '========================================='
      echo 'Pipeline completed successfully! ✅'
      echo '========================================='
      echo 'Access your applications:'
      echo 'Frontend: kubectl get service healthhub-frontend-service'
      echo 'Backend: kubectl get service healthhub-backend-service'
      echo '========================================='
    }
    failure {
      echo '========================================='
      echo 'Pipeline failed! ❌'
      echo 'Check the logs above for error details.'
      echo '========================================='
    }
    always {
      echo 'Cleaning up...'
    }
  }
}