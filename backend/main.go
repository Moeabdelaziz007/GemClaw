package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"firebase.google.com/go/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	app := fiber.New(fiber.Config{
		AppName: "Gemclaw ClawHub Neural Spine v0.1.0",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())

	// Firebase Admin Setup (Phase 2)
	ctx := context.Background()
	_ , err := firebase.NewApp(ctx, nil)
	if err != nil {
		log.Printf("⚠️  Firebase Admin warning: %v (Proceeding in local-only mode)", err)
	}

	// Health Check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.Status(200).JSON(fiber.Map{
			"status":  "conscious",
			"engine":  "ClawHub-Go",
			"version": "0.1.0",
		})
	})

	// Port configuration
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🧬 Gemclaw ClawHub Neural Spine Active on port " + port)
	log.Fatal(app.Listen(":" + port))
}
