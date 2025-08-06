"use client"

import React from 'react'
import { ExampleWrapper } from '@/components/samples/example-wrapper'
import { PartyWelcomeCard } from '@/components/samples/party-welcome-card'
import { OceanInfoCard } from '@/components/samples/ocean-info-card'
import { GameRulesList } from '@/components/samples/game-rules-list'
import { RecipeCard } from '@/components/samples/recipe-card'
import { ContactForm } from '@/components/samples/contact-form'
import { examplePrompts } from '@/data/example-prompts'
import { componentCode } from '@/data/component-code'

export function SamplesGallery() {
  // Map component imports to their IDs
  const componentMap = {
    'party-welcome': PartyWelcomeCard,
    'ocean-info': OceanInfoCard,
    'game-rules': GameRulesList,
    'recipe-card': RecipeCard,
    'contact-form': ContactForm
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {examplePrompts.map((example) => {
        const Component = componentMap[example.id as keyof typeof componentMap]
        
        return (
          <ExampleWrapper
            key={example.id}
            title={example.title}
            prompt={example.prompt}
            code={componentCode[example.id as keyof typeof componentCode]}
          >
            <Component />
          </ExampleWrapper>
        )
      })}
    </div>
  )
}