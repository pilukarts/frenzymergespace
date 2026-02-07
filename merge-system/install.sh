#!/bin/bash

# Script de instalación del Sistema de Merge para Forgenite Frenzy
# Este script copia todos los archivos necesarios a tu proyecto

echo "🚀 Instalando Sistema de Merge Espacial..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: No se encontró package.json${NC}"
    echo "Por favor, ejecuta este script desde la raíz de tu proyecto Next.js"
    exit 1
fi

# Crear directorio destino
echo -e "${BLUE}📁 Creando directorio src/merge-game...${NC}"
mkdir -p src/merge-game

# Copiar archivos
echo -e "${BLUE}📋 Copiando archivos...${NC}"

# Tipos
cp -r src/types src/merge-game/ 2>/dev/null || echo -e "${YELLOW}⚠️  No se encontró src/types${NC}"

# Hooks
cp -r src/hooks src/merge-game/ 2>/dev/null || echo -e "${YELLOW}⚠️  No se encontró src/hooks${NC}"

# Componentes
cp -r src/components src/merge-game/ 2>/dev/null || echo -e "${YELLOW}⚠️  No se encontró src/components${NC}"

# Lib (Firebase)
cp -r src/lib src/merge-game/ 2>/dev/null || echo -e "${YELLOW}⚠️  No se encontró src/lib${NC}"

# Archivo principal
cp src/index.ts src/merge-game/ 2>/dev/null || echo -e "${YELLOW}⚠️  No se encontró src/index.ts${NC}"

echo ""
echo -e "${GREEN}✅ Archivos copiados correctamente!${NC}"
echo ""

# Verificar dependencias
echo -e "${BLUE}🔍 Verificando dependencias...${NC}"

if ! grep -q "framer-motion" package.json; then
    echo -e "${YELLOW}⚠️  framer-motion no está instalado${NC}"
    echo -e "${BLUE}📦 Instalando framer-motion...${NC}"
    npm install framer-motion
else
    echo -e "${GREEN}✅ framer-motion ya está instalado${NC}"
fi

echo ""

# Crear página de ejemplo
echo -e "${BLUE}📝 Creando página de ejemplo...${NC}"
mkdir -p app/merge
cat > app/merge/page.tsx << 'EOF'
'use client';

import dynamic from 'next/dynamic';

const MergeGame = dynamic(
  () => import('@/merge-game').then(mod => mod.MergeGame),
  { ssr: false }
);

export default function MergePage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <MergeGame />
    </main>
  );
}
EOF

echo -e "${GREEN}✅ Página creada: app/merge/page.tsx${NC}"
echo ""

# Actualizar globals.css
echo -e "${BLUE}🎨 Actualizando estilos...${NC}"
if [ -f "app/globals.css" ]; then
    cat >> app/globals.css << 'EOF'

/* Merge Game Styles */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  border-radius: 3px;
}
EOF
    echo -e "${GREEN}✅ Estilos añadidos a app/globals.css${NC}"
else
    echo -e "${YELLOW}⚠️  No se encontró app/globals.css${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Instalación completada!${NC}"
echo ""
echo "📖 Próximos pasos:"
echo ""
echo "1. Configura tus variables de entorno en .env.local:"
echo "   NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key"
echo "   NEXT_PUBLIC_FIREBASE_PROJECT_ID=forgeite-frenzy"
echo ""
echo "2. Visita http://localhost:3000/merge para probar el juego"
echo ""
echo "3. Lee la documentación en: src/merge-game/README.md"
echo ""
echo -e "${BLUE}🚀 Listo para despegar!${NC}"
