FROM openjdk:17-jdk-slim

WORKDIR /app

COPY gradle gradle
COPY gradlew .
COPY build.gradle .
COPY settings.gradle .

RUN ./gradlew build --no-daemon || return 0

COPY src src

RUN ./gradlew build --no-daemon

EXPOSE 8080

CMD ["java", "-jar", "build/libs/ucms-0.0.1-SNAPSHOT.jar"]