const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(` Error executing slash command ${interaction.commandName}:`, error);
        interaction.reply({
          content: ' There was an error executing this command.',
          ephemeral: true,
        }).catch(console.error);
      }
    }

    // Handle order type dropdown
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'order_type_select') {
        try {
          const orderType = interaction.values[0];
          const userId = interaction.user.id;
          const guild = interaction.guild;
          const categoryId = '1460662202725040385';
          const staffId1 = '1457331661992759323'; // ariu.x
          const staffId2 = '1347129007321387068'; // nikcreates_

          // Determine channel name based on selection
          let channelName = '';
          if (orderType === 'discord_bot') {
            channelName = 'discord-bots-order';
          } else if (orderType === 'banner') {
            channelName = 'banner-order';
          }

          // Create the text channel without permission overwrites first
          const channel = await guild.channels.create({
            name: channelName,
            type: 0, // 0 is text channel
            parent: categoryId,
          });

          // Set permissions after channel creation
          try {
            // Deny everyone first
            await channel.permissionOverwrites.create(guild.id, {
              ViewChannel: false,
            });
            
            // Allow the order creator
            await channel.permissionOverwrites.create(userId, {
              ViewChannel: true,
              SendMessages: true,
              ReadMessageHistory: true,
            });
            
            // Allow staff members
            await channel.permissionOverwrites.create(staffId1, {
              ViewChannel: true,
              SendMessages: true,
              ReadMessageHistory: true,
            });
            
            await channel.permissionOverwrites.create(staffId2, {
              ViewChannel: true,
              SendMessages: true,
              ReadMessageHistory: true,
            });
          } catch (permError) {
            console.error('Error setting channel permissions:', permError);
          }

          // Create the embed for the order channel
          const orderEmbed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle('Order Created')
            .setDescription(
              `Please wait patiently until <@${staffId1}> or <@${staffId2}> claims your order.\n\n` +
              `To close this order, click the "Close" button below once your order is complete.`
            );

          // Create close button
          const closeButton = new ButtonBuilder()
            .setCustomId(`close_order_${channel.id}`)
            .setLabel('Close')
            .setStyle(ButtonStyle.Danger);

          const buttonRow = new ActionRowBuilder().addComponents(closeButton);

          // Send the order embed to the channel
          await channel.send({
            content: `<@${userId}>`,
            embeds: [orderEmbed],
            components: [buttonRow],
          });

          // Reply to the interaction
          await interaction.reply({
            content: ` Your order channel has been created: <#${channel.id}>`,
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error creating order channel:', error);
          await interaction.reply({
            content: ' There was an error creating your order channel.',
            ephemeral: true,
          });
        }
      }
    }

    // Handle close button
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('close_order_')) {
        try {
          const channelId = interaction.customId.replace('close_order_', '');
          const channel = interaction.guild.channels.cache.get(channelId);

          if (!channel) {
            return await interaction.reply({
              content: ' Channel not found.',
              ephemeral: true,
            });
          }

          // Check if user is the order creator or a staff member
          const staffId1 = '1457331661992759323'; // ariu.x
          const staffId2 = '1347129007321387068'; // nikcreates_
          const userId = interaction.user.id;

          // Get the order creator from channel permissions
          const orderCreator = Array.from(channel.permissionOverwrites.cache.values()).find(
            perm => perm.type === 'user' && perm.allow.has('ViewChannel') && perm.id !== staffId1 && perm.id !== staffId2
          );

          const isStaff = userId === staffId1 || userId === staffId2;
          const isCreator = orderCreator && orderCreator.id === userId;

          if (!isStaff && !isCreator) {
            return await interaction.reply({
              content: ' You do not have permission to close this order.',
              ephemeral: true,
            });
          }

          // Delete the channel
          await interaction.reply({
            content: ' Order channel is being closed...',
            ephemeral: true,
          });

          // Wait a moment before deleting
          await new Promise(resolve => setTimeout(resolve, 1000));
          await channel.delete();
        } catch (error) {
          console.error('Error closing order channel:', error);
          await interaction.reply({
            content: ' There was an error closing the order channel.',
            ephemeral: true,
          });
        }
      }
    }

    // Handle review designer selection
    if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'review_designer_select') {
        try {
          const designerId = interaction.values[0];
          const designerName = designerId === '1457331661992759323' ? 'ariu.x' : 'nikcreates_';

          // Store designer selection in interaction metadata
          await interaction.reply({
            content: `Designer selected: **${designerName}**\n\nStep 2: Select a product`,
            components: [
              new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId(`review_product_select_${designerId}`)
                  .setPlaceholder('Select a product')
                  .addOptions([
                    {
                      label: 'Discord Bot',
                      value: 'discord_bot',
                      description: 'Review a Discord Bot',
                    },
                    {
                      label: 'Banner',
                      value: 'banner',
                      description: 'Review a Banner',
                    },
                  ])
              ),
            ],
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error selecting designer:', error);
          await interaction.reply({
            content: 'There was an error selecting the designer.',
            ephemeral: true,
          });
        }
      }

      // Handle review product selection
      if (interaction.customId.startsWith('review_product_select_')) {
        try {
          const designerId = interaction.customId.replace('review_product_select_', '');
          const product = interaction.values[0];
          const productName = product === 'discord_bot' ? 'Discord Bot' : 'Banner';

          // Create rating buttons (1-5 stars)
          const ratingRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`review_rating_1_${designerId}_${product}`)
              .setLabel('⭐')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`review_rating_2_${designerId}_${product}`)
              .setLabel('⭐⭐')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`review_rating_3_${designerId}_${product}`)
              .setLabel('⭐⭐⭐')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`review_rating_4_${designerId}_${product}`)
              .setLabel('⭐⭐⭐⭐')
              .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
              .setCustomId(`review_rating_5_${designerId}_${product}`)
              .setLabel('⭐⭐⭐⭐⭐')
              .setStyle(ButtonStyle.Secondary)
          );

          await interaction.reply({
            content: `Product selected: **${productName}**\n\nStep 3: Select a rating`,
            components: [ratingRow],
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error selecting product:', error);
          await interaction.reply({
            content: 'There was an error selecting the product.',
            ephemeral: true,
          });
        }
      }
    }

    // Handle rating buttons
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('review_rating_')) {
        try {
          const parts = interaction.customId.split('_');
          const rating = parseInt(parts[2]);
          const designerId = parts[3];
          const product = parts[4];

          // Show modal for feedback
          const modal = new ModalBuilder()
            .setCustomId(`review_feedback_${rating}_${designerId}_${product}`)
            .setTitle('Review Feedback');

          const feedbackInput = new TextInputBuilder()
            .setCustomId('review_feedback_text')
            .setLabel('Your feedback')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Share your feedback about this product/designer...')
            .setRequired(true)
            .setMaxLength(1024);

          const feedbackRow = new ActionRowBuilder().addComponents(feedbackInput);
          modal.addComponents(feedbackRow);

          await interaction.showModal(modal);
        } catch (error) {
          console.error('Error handling rating button:', error);
          await interaction.reply({
            content: 'There was an error processing your rating.',
            ephemeral: true,
          });
        }
      }

      // Close order button (existing functionality)
      if (interaction.customId.startsWith('close_order_')) {
        try {
          const channelId = interaction.customId.replace('close_order_', '');
          const channel = interaction.guild.channels.cache.get(channelId);

          if (!channel) {
            return await interaction.reply({
              content: ' Channel not found.',
              ephemeral: true,
            });
          }

          // Check if user is the order creator or a staff member
          const staffId1 = '1457331661992759323'; // ariu.x
          const staffId2 = '1347129007321387068'; // nikcreates_
          const userId = interaction.user.id;

          // Get the order creator from channel permissions
          const orderCreator = Array.from(channel.permissionOverwrites.cache.values()).find(
            perm => perm.type === 'user' && perm.allow.has('ViewChannel') && perm.id !== staffId1 && perm.id !== staffId2
          );

          const isStaff = userId === staffId1 || userId === staffId2;
          const isCreator = orderCreator && orderCreator.id === userId;

          if (!isStaff && !isCreator) {
            return await interaction.reply({
              content: ' You do not have permission to close this order.',
              ephemeral: true,
            });
          }

          // Delete the channel
          await interaction.reply({
            content: ' Order channel is being closed...',
            ephemeral: true,
          });

          // Wait a moment before deleting
          await new Promise(resolve => setTimeout(resolve, 1000));
          await channel.delete();
        } catch (error) {
          console.error('Error closing order channel:', error);
          await interaction.reply({
            content: ' There was an error closing the order channel.',
            ephemeral: true,
          });
        }
      }
    }

    // Handle modal submissions
    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('review_feedback_')) {
        try {
          const parts = interaction.customId.split('_');
          const rating = parseInt(parts[2]);
          const designerId = parts[3];
          const product = parts[4];
          const feedback = interaction.fields.getTextInputValue('review_feedback_text');
          const reviewChannelId = '1460329987239448772';

          // Get review count (you might want to use a database for this)
          if (!global.reviewCount) {
            global.reviewCount = 1;
          } else {
            global.reviewCount++;
          }

          const designerName = designerId === '1457331661992759323' ? 'ariu.x' : 'nikcreates_';
          const productName = product === 'discord_bot' ? 'Discord Bot' : 'Banner';
          const starRating = '⭐'.repeat(rating);

          // Create review embed
          const reviewEmbed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle(`Review #${global.reviewCount}`)
            .addFields(
              { name: 'Product', value: productName, inline: true },
              { name: 'Designer', value: `<@${designerId}>`, inline: true },
              { name: 'Rating', value: starRating, inline: true },
              { name: 'Feedback', value: feedback, inline: false },
              { name: 'Reviewer', value: `<@${interaction.user.id}>`, inline: true }
            )
            .setTimestamp();

          // Send to review channel
          const reviewChannel = await interaction.client.channels.fetch(reviewChannelId);
          if (reviewChannel) {
            await reviewChannel.send({ embeds: [reviewEmbed] });
          }

          // Reply to user
          await interaction.reply({
            content: `Your review has been submitted!\n\nReview #${global.reviewCount}\nProduct: ${productName}\nDesigner: ${designerName}\nRating: ${starRating}\n\nThank you for your feedback!`,
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error submitting review:', error);
          await interaction.reply({
            content: 'There was an error submitting your review.',
            ephemeral: true,
          });
        }
      }

      // Handle giveaway enter button
      if (interaction.customId === 'giveaway_enter') {
        try {
          // Initialize giveaway participants map if not exists
          if (!client.giveawayParticipants) {
            client.giveawayParticipants = new Map();
          }

          const messageId = interaction.message.id;
          if (!client.giveawayParticipants.has(messageId)) {
            client.giveawayParticipants.set(messageId, new Set());
          }

          const participants = client.giveawayParticipants.get(messageId);
          if (participants.has(interaction.user.id)) {
            return await interaction.reply({
              content: 'You are already entered in this giveaway!',
              ephemeral: true,
            });
          }

          participants.add(interaction.user.id);
          await interaction.reply({
            content: 'You have entered the giveaway!',
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error handling giveaway enter:', error);
          await interaction.reply({
            content: 'There was an error entering the giveaway.',
            ephemeral: true,
          });
        }
      }

      // Handle giveaway leave button
      if (interaction.customId === 'giveaway_leave') {
        try {
          if (!client.giveawayParticipants) {
            client.giveawayParticipants = new Map();
          }

          const messageId = interaction.message.id;
          if (!client.giveawayParticipants.has(messageId)) {
            return await interaction.reply({
              content: 'You are not in this giveaway.',
              ephemeral: true,
            });
          }

          const participants = client.giveawayParticipants.get(messageId);
          if (!participants.has(interaction.user.id)) {
            return await interaction.reply({
              content: 'You are not in this giveaway.',
              ephemeral: true,
            });
          }

          participants.delete(interaction.user.id);
          await interaction.reply({
            content: 'You have left the giveaway.',
            ephemeral: true,
          });
        } catch (error) {
          console.error('Error handling giveaway leave:', error);
          await interaction.reply({
            content: 'There was an error leaving the giveaway.',
            ephemeral: true,
          });
        }
      }
    }
  },
};
