async def get(f):
    with open(f, "r") as o:
        test = o.read()
    if len(test) > 0: return eval(test)
    return {}

async def set(f, dic):
    with open(f, "w") as o:
        o.write(str(dic))

async def truncate(f):
    set(f, {})


import os
import discord
from discord.ext import commands
import random
import re

import requests

description = '''An example bot to showcase the discord.ext.commands extension
module.
There are a number of utility commands being showcased here.'''

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix='?', description=description, intents=intents)


async def apostar(message, file):
    await message.reply(f"Para apostar: \n1. Entre no site: SITE\n2. Responda todos os jogos \n3. **Envie pra mim, aqui pela DM do discord, o Codigo de Aposta**.\n**Obs**: O Código de Aposta deve parecer com:\n> Aposta(0:[...]...)")

async def status(message, file):
    pass


command_list = {"apostar":{"desc":"Cria uma aposta/edita se você já tiver uma.", "function":apostar}, "status":{"desc":"Mostra o status da sua aposta.", "function":status}}

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user} (ID: {bot.user.id})')
    print('------')
    if not os.path.exists("users"):
        os.makedirs("users")
        print("Setup inicial OK")
        print('------')




@bot.event
async def on_message(message):
    if message.channel.type == discord.ChannelType.private and message.author != bot.user:
        file = f"users/{message.author.id}.json"
        if not os.path.exists(file):
            await truncate(file)
            print(f"User {message.author.name} registred.")

        #commands
        msg = message.content.lower()
        if msg in command_list:
            await command_list[msg]["function"](message, file)
        else:
            if re.search("^({'groups':{'A':).*(}}})$", message.content):
                await set(file, message.content)
                await message. reply("Aposta definida com sucesso!")
            else:
                await message. reply("Comandos: \n"+ "\n".join([f"> **{x}**: {command_list[x]['desc']}" for x in command_list]))





import secret
bot.run(secret.getToken())
