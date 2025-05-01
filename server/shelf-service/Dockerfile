# Сборка
FROM gradle:8-jdk17-alpine AS build
WORKDIR /app
COPY build.gradle .
COPY src ./src
RUN gradle bootJar --no-daemon

# Запуск
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]