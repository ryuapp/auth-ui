import { Provider, SupabaseClient } from '@supabase/supabase-js'
import { createSignal, For, Show } from 'solid-js'
import { I18nVariables, SocialLayout, template } from '@supabase/auth-ui-shared'
import { Appearance } from '../../../types'
import { Button, Container, Divider } from '../../UI'
import * as SocialIcons from '../Icons'

interface SocialAuthProps {
  supabaseClient: SupabaseClient
  socialLayout: SocialLayout | string
  providers?: Provider[]
  redirectTo: RedirectTo
  onlyThirdPartyProviders: boolean
  view: 'sign_in' | 'sign_up'
  i18n: I18nVariables
  appearance?: Appearance
}

type RedirectTo = undefined | string

function SocialAuth(props: SocialAuthProps) {
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal('')

  const handleProviderSignIn = async (provider: Provider) => {
    setLoading(true)
    const { error } = await props.supabaseClient.auth.signInWithOAuth({
      provider,
      options: { redirectTo: props.redirectTo },
    })
    if (error) setError(error.message)
    setLoading(false)
  }

  function capitalize(word: string) {
    const lower = word.toLowerCase()
    return word.charAt(0).toUpperCase() + lower.slice(1)
  }

  return (
    <>
      {props.providers && props.providers.length > 0 && (
        <>
          <Container
            gap="large"
            direction="vertical"
            appearance={props.appearance}
          >
            <Container
              direction={props.socialLayout}
              gap={props.socialLayout === 'vertical' ? 'small' : 'medium'}
              appearance={props.appearance}
            >
              <For each={props.providers}>
                {(provider: Provider) => {
                  const AuthIcon = SocialIcons[provider]
                  return (
                    <Button
                      color="default"
                      icon={AuthIcon ? <AuthIcon /> : ''}
                      loading={loading()}
                      onClick={() => handleProviderSignIn(provider)}
                      appearance={props.appearance}
                    >
                      {props.socialLayout === 'vertical' &&
                        template(
                          props.i18n[props.view]
                            ?.social_provider_text as string,
                          {
                            provider: capitalize(provider),
                          }
                        )}
                    </Button>
                  )
                }}
              </For>
            </Container>
          </Container>
          <Show when={!props.onlyThirdPartyProviders}>
            <Divider appearance={props.appearance} />
          </Show>
        </>
      )}
    </>
  )
}

export { SocialAuth }
