#!/bin/bash
echo ""
echo " =================================="
echo "  EstudaVitor - Iniciando servidor..."
echo " =================================="
echo ""
cd "$(dirname "$0")"
echo " Acesse: http://localhost:3737"
echo ""
node server.js
