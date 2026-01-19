pipeline {
  agent any

  tools {
    jdk 'jdk17'
    maven 'maven3'
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
          sh 'mvn clean test'
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('frontend') {
          sh '''
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
            sh '''
              mvn sonar:sonar \
              -Dsonar.projectKey=$SONAR_PROJECT_KEY_BACKEND
            '''
          }
          dir('frontend') {
            sh '''
              npm run sonar \
              || echo "Frontend sonar configured via CLI"
            '''
          }
        }
      }
    }

    stage('Build Docker Images') {
      steps {
        sh '''
          docker build -t mohamed510/backend:latest backend
          docker build -t mohamed510/frontend:latest frontend
        '''
      }
    }

    stage('Push to Docker Hub') {
      steps {
        sh '''
          echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
          docker push mohamed510/backend:latest
          docker push mohamed510/frontend:latest
        '''
      }
    }
  }
}
