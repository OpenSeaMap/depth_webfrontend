APPNAME = 'OSeaM-depth'
VERSION = '0.1'


top = '.'
out = 'build'


def configure(ctx):
    ctx.recurse('src')

    env = ctx.env

    ctx.setenv('debug', env)
    ctx.env.NAME   = 'debug'
    ctx.env.PREFIX = './debug'

    ctx.setenv('release', env)
    ctx.env.NAME   = 'release'
    ctx.env.PREFIX = './release'




def build(ctx):
    if not ctx.variant:
        ctx.fatal('call "waf build_debug" or "waf build_release", and try "waf --help"')
    ctx.recurse('src')



from waflib.Build import BuildContext, CleanContext, \
        InstallContext, UninstallContext

for x in 'debug release'.split():
    for y in (BuildContext, CleanContext, InstallContext, UninstallContext):
        name = y.__name__.replace('Context','').lower()
        class tmp(y):
            cmd = name + '_' + x
            variant = x
